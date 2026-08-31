import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Schedule, Assignment, Announcement } from '@/types';

// ============================================================
// Hook: data real untuk Dashboard Admin
// ============================================================
export function useAdminDashboardData() {
  const [stats, setStats] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    totalKelas: 0,
    totalJadwal: 0,
  });
  const [activities, setActivities] = useState<{ text: string; time: string; tone: 'orange' | 'green' | 'gold' | 'yellow' }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [teacherRes, studentRes, classRes, scheduleRes, announcementRes, assignmentRes] = await Promise.all([
        supabase.from('teachers').select('id, full_name, created_at', { count: 'exact', head: false }),
        supabase.from('students').select('id, full_name, created_at', { count: 'exact', head: false }),
        supabase.from('classes').select('id, name', { count: 'exact', head: false }),
        supabase.from('schedules').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('assignments').select('title, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      if (teacherRes.error) throw teacherRes.error;
      if (studentRes.error) throw studentRes.error;
      if (classRes.error) throw classRes.error;
      if (scheduleRes.error) throw scheduleRes.error;

      setStats({
        totalGuru: teacherRes.count || 0,
        totalSiswa: studentRes.count || 0,
        totalKelas: classRes.count || 0,
        totalJadwal: scheduleRes.count || 0,
      });

      // Build activity feed from real data
      const acts: { text: string; time: string; tone: 'orange' | 'green' | 'gold' | 'yellow' }[] = [];

      (announcementRes.data || []).forEach((a: Pick<Announcement, 'title' | 'created_at'>, i: number) => {
        acts.push({
          text: `Pengumuman: ${a.title}`,
          time: formatRelativeTime(a.created_at) + ' · oleh Sistem',
          tone: (['orange', 'green', 'gold', 'yellow'] as const)[i % 4],
        });
      });

      (assignmentRes.data || []).forEach((a: Pick<Assignment, 'title' | 'created_at'>, i: number) => {
        acts.push({
          text: `Tugas baru: ${a.title}`,
          time: formatRelativeTime(a.created_at) + ' · oleh Guru',
          tone: (['green', 'gold', 'yellow', 'orange'] as const)[i % 4],
        });
      });

      setActivities(acts.slice(0, 6));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
      setError(msg);
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, activities, loading, error, reload: load };
}

// ============================================================
// Hook: data real untuk Dashboard Guru
// ============================================================
export function useGuruDashboardData(teacherId: string) {
  const [stats, setStats] = useState({
    kelasAktif: 0,
    totalSiswa: 0,
    tugasAktif: 0,
    rataRataKehadiran: 0,
  });
  const [jadwalHariIni, setJadwalHariIni] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get teacher's classes
      const { data: teacherClasses, error: tcError } = await supabase
        .from('teacher_classes')
        .select('class_id')
        .eq('teacher_id', teacherId);
      if (tcError) throw tcError;
      const classIds = (teacherClasses || []).map((tc: { class_id: string }) => tc.class_id);

      if (classIds.length === 0) {
        setStats({ kelasAktif: 0, totalSiswa: 0, tugasAktif: 0, rataRataKehadiran: 0 });
        setJadwalHariIni([]);
        return;
      }

      // Count students in those classes
      const { count: totalSiswa, error: sError } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .in('class_id', classIds)
        .eq('is_active', true);
      if (sError) throw sError;

      // Count active assignments
      const { count: tugasAktif, error: aError } = await supabase
        .from('assignments')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', teacherId)
        .eq('status', 'active');
      if (aError) throw aError;

      // Get today's schedule
      const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
      const dayMap: Record<string, string> = {
        'Senin': 'Senin', 'Selasa': 'Selasa', 'Rabu': 'Rabu', 'Kamis': 'Kamis',
        'Jumat': 'Jumat', 'Sabtu': 'Sabtu', 'Minggu': 'Minggu',
      };
      const todayId = dayMap[today] || today;
      const { data: schedules, error: schError } = await supabase
        .from('schedules')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('day', todayId)
        .order('start_time');
      if (schError) throw schError;

      // Calculate attendance
      const { data: students, error: stError } = await supabase
        .from('students')
        .select('id')
        .in('class_id', classIds)
        .eq('is_active', true);
      if (stError) throw stError;
      const studentIds = (students || []).map((s: { id: string }) => s.id);

      let rataRataKehadiran = 0;
      if (studentIds.length > 0) {
        const { data: attendance, error: attError } = await supabase
          .from('attendance')
          .select('status')
          .in('student_id', studentIds);
        if (attError) throw attError;
        const total = (attendance || []).length;
        const hadir = (attendance || []).filter((a: { status: string }) => a.status === 'hadir').length;
        rataRataKehadiran = total > 0 ? Math.round((hadir / total) * 100) : 0;
      }

      setStats({
        kelasAktif: classIds.length,
        totalSiswa: totalSiswa || 0,
        tugasAktif: tugasAktif || 0,
        rataRataKehadiran,
      });
      setJadwalHariIni(schedules || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
      setError(msg);
      console.error('Guru dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  return { stats, jadwalHariIni, loading, error, reload: load };
}

// ============================================================
// Hook: data real untuk Dashboard Siswa
// ============================================================
export function useSiswaDashboardData(studentId: string, classId: string | null) {
  const [stats, setStats] = useState({
    mataPelajaran: 0,
    tugasAktif: 0,
    rataRataNilai: 0,
    kehadiran: 0,
  });
  const [jadwalMingguan, setJadwalMingguan] = useState<(Schedule & { teacher_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!classId) {
      setStats({ mataPelajaran: 0, tugasAktif: 0, rataRataNilai: 0, kehadiran: 0 });
      setJadwalMingguan([]);
      setLoading(false);
      return;
    }

    try {
      // Get full weekly schedule with teacher names
      const { data: schedules, error: schError } = await supabase
        .from('schedules')
        .select(`
          *,
          teachers!inner(full_name)
        `)
        .eq('class_id', classId)
        .order('day')
        .order('start_time');
      if (schError) throw schError;

      const enriched = (schedules || []).map((s: Schedule & { teachers: { full_name: string } }) => ({
        ...s,
        teacher_name: s.teachers?.full_name || 'Tidak diketahui',
      }));
      setJadwalMingguan(enriched);

      const subjects = new Set(enriched.map((s) => s.subject));

      // Count active assignments for this class
      const { count: tugasAktif, error: aError } = await supabase
        .from('assignments')
        .select('id', { count: 'exact', head: true })
        .eq('class_id', classId)
        .eq('status', 'active');
      if (aError) throw aError;

      // Get grades for this student
      const { data: grades, error: gError } = await supabase
        .from('grades')
        .select('score, max_score')
        .eq('student_id', studentId);
      if (gError) throw gError;
      const avgNilai = (grades || []).length > 0
        ? Math.round((grades || []).reduce((sum: number, g: { score: number; max_score: number }) => sum + (g.score / g.max_score) * 100, 0) / (grades || []).length)
        : 0;

      // Get attendance for this student
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId);
      if (attError) throw attError;
      const totalAtt = (attendance || []).length;
      const hadir = (attendance || []).filter((a: { status: string }) => a.status === 'hadir').length;
      const kehadiran = totalAtt > 0 ? Math.round((hadir / totalAtt) * 100) : 0;

      setStats({
        mataPelajaran: subjects.size,
        tugasAktif: tugasAktif || 0,
        rataRataNilai: avgNilai,
        kehadiran,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
      setError(msg);
      console.error('Siswa dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId, classId]);

  useEffect(() => { load(); }, [load]);

  return { stats, jadwalMingguan, loading, error, reload: load };
}

// ============================================================
// Hook: data real untuk Dashboard Orang Tua
// ============================================================
export function useOrtuDashboardData(childStudentId: string, childClassId: string | null) {
  const [stats, setStats] = useState({
    rataRataNilai: 0,
    kehadiran: 0,
    tugasAktif: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!childStudentId) {
      setStats({ rataRataNilai: 0, kehadiran: 0, tugasAktif: 0 });
      setLoading(false);
      return;
    }

    try {
      // Grades
      const { data: grades, error: gError } = await supabase
        .from('grades')
        .select('score, max_score')
        .eq('student_id', childStudentId);
      if (gError) throw gError;
      const avgNilai = (grades || []).length > 0
        ? Math.round((grades || []).reduce((sum: number, g: { score: number; max_score: number }) => sum + (g.score / g.max_score) * 100, 0) / (grades || []).length)
        : 0;

      // Attendance
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', childStudentId);
      if (attError) throw attError;
      const totalAtt = (attendance || []).length;
      const hadir = (attendance || []).filter((a: { status: string }) => a.status === 'hadir').length;
      const kehadiran = totalAtt > 0 ? Math.round((hadir / totalAtt) * 100) : 0;

      // Active assignments for child's class
      let tugasAktif = 0;
      if (childClassId) {
        const { count, error: aError } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', childClassId)
          .eq('status', 'active');
        if (aError) throw aError;
        tugasAktif = count || 0;
      }

      setStats({ rataRataNilai: avgNilai, kehadiran, tugasAktif });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
      setError(msg);
      console.error('Ortu dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [childStudentId, childClassId]);

  useEffect(() => { load(); }, [load]);

  return { stats, loading, error, reload: load };
}

// ============================================================
// Hook: data real untuk Dashboard Tamu
// ============================================================
export function useTamuDashboardData() {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKelas: 0,
    totalPengumuman: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, tRes, cRes, aRes] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('classes').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
      ]);
      if (sRes.error) throw sRes.error;
      if (tRes.error) throw tRes.error;
      if (cRes.error) throw cRes.error;
      if (aRes.error) throw aRes.error;
      setStats({
        totalSiswa: sRes.count || 0,
        totalGuru: tRes.count || 0,
        totalKelas: cRes.count || 0,
        totalPengumuman: aRes.count || 0,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data';
      setError(msg);
      console.error('Tamu dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, loading, error, reload: load };
}

// ============================================================
// Helper: format waktu relatif (Indonesia)
// ============================================================
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
