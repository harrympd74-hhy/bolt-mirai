// ============================================================
// MIRAI - Selectors
// Selector tingkat tinggi yang menggabungkan data dari multiple store.
// Inilah jantung keterhubungan data: Admin/Guru input → otomatis
// terlihat di Dasbor Guru, Siswa, dan Orang Tua.
// ============================================================

import { useGuruStore } from '@/stores/useGuruStore';
import { useKelasStore } from '@/stores/useKelasStore';
import { useSiswaStore } from '@/stores/useSiswaStore';
import { useAkademikStore } from '@/stores/useAkademikStore';
import { usePengumumanStore } from '@/stores/usePengumumanStore';
import type {
  KelasWithRelations, StudentWithKelas, ScheduleWithRelations,
  AssignmentWithRelations, GradeWithRelations, MaterialWithRelations,
  AnnouncementWithAuthor, GuruDashboardStats, SiswaDashboardStats,
  OrtuDashboardStats,
} from '@/types';

// ============================================================
// GURU SELECTORS
// ============================================================

/**
 * Statistik untuk Beranda Guru.
 * Mengambil data dari kelas yang diampu, siswa di kelas tersebut,
 * tugas yang belum dinilai, dan rata-rata kehadiran.
 */
export function getGuruDashboardStats(teacherId: string): GuruDashboardStats {
  const kelasStore = useKelasStore.getState();
  const siswaStore = useSiswaStore.getState();
  const akademikStore = useAkademikStore.getState();

  const kelasDiampu = kelasStore.getByTeacher(teacherId);
  const classIds = kelasDiampu.map((k) => k.id);

  // Total siswa di semua kelas yang diampu
  const totalSiswa = siswaStore.students.filter(
    (s) => s.class_id !== null && classIds.includes(s.class_id) && s.is_active
  ).length;

  // Tugas aktif yang belum dinilai
  const tugasGuru = akademikStore.getAssignmentByTeacher(teacherId);
  const tugasBelumDinilai = tugasGuru.filter((t) => t.status === 'active').length;

  // Rata-rata kehadiran siswa di kelas yang diampu (30 hari terakhir)
  const siswaIds = siswaStore.students
    .filter((s) => s.class_id !== null && classIds.includes(s.class_id))
    .map((s) => s.id);
  const attendanceRecords = akademikStore.attendance.filter(
    (a) => siswaIds.includes(a.student_id)
  );
  const hadirCount = attendanceRecords.filter((a) => a.status === 'hadir').length;
  const rataRataKehadiran = attendanceRecords.length > 0
    ? Math.round((hadirCount / attendanceRecords.length) * 100)
    : 0;

  return {
    kelasAktif: kelasDiampu.length,
    totalSiswa,
    tugasBelumDinilai,
    rataRataKehadiran,
  };
}

/**
 * Kelas yang diampu guru dengan relasi lengkap (jumlah siswa, nama wali kelas).
 */
export function getGuruKelasWithRelations(teacherId: string): KelasWithRelations[] {
  const kelasStore = useKelasStore.getState();
  const siswaStore = useSiswaStore.getState();
  const guruStore = useGuruStore.getState();

  const kelasDiampu = kelasStore.getByTeacher(teacherId);
  return kelasDiampu.map((k) => {
    const wali = k.wali_kelas_id ? guruStore.getById(k.wali_kelas_id) : null;
    const studentCount = siswaStore.students.filter(
      (s) => s.class_id === k.id && s.is_active
    ).length;
    const teacherCount = kelasStore.teacherClasses.filter(
      (tc) => tc.class_id === k.id
    ).length;
    return {
      ...k,
      wali_kelas_name: wali?.full_name ?? null,
      student_count: studentCount,
      teacher_count: teacherCount,
    };
  });
}

/**
 * Jadwal mengajar guru untuk hari tertentu, dengan relasi nama kelas.
 */
export function getGuruScheduleToday(teacherId: string, day: string): ScheduleWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();

  return akademikStore.getScheduleToday(teacherId, day).map((s) => {
    const kelas = kelasStore.getById(s.class_id);
    return {
      ...s,
      teacher_name: '',
      class_name: kelas?.name ?? 'Tidak diketahui',
    };
  });
}

/**
 * Semua jadwal mengajar guru, dengan relasi.
 */
export function getGuruAllSchedules(teacherId: string): ScheduleWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  return akademikStore.getScheduleByTeacher(teacherId).map((s) => {
    const kelas = kelasStore.getById(s.class_id);
    const guru = guruStore.getById(s.teacher_id);
    return {
      ...s,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? 'Tidak diketahui',
    };
  });
}

/**
 * Tugas yang dibuat guru, dengan relasi nama kelas.
 */
export function getGuruAssignments(teacherId: string): AssignmentWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  return akademikStore.getAssignmentByTeacher(teacherId).map((a) => {
    const kelas = kelasStore.getById(a.class_id);
    const guru = guruStore.getById(a.teacher_id);
    return {
      ...a,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? 'Tidak diketahui',
    };
  });
}

/**
 * Materi yang dibuat guru, dengan relasi.
 */
export function getGuruMaterials(teacherId: string): MaterialWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  return akademikStore.getMaterialByTeacher(teacherId).map((m) => {
    const kelas = kelasStore.getById(m.class_id);
    const guru = guruStore.getById(m.teacher_id);
    return {
      ...m,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? 'Tidak diketahui',
    };
  });
}

/**
 * Siswa di kelas yang diampu guru (untuk input nilai/kehadiran).
 */
export function getGuruSiswaByClass(teacherId: string): StudentWithKelas[] {
  const kelasStore = useKelasStore.getState();
  const siswaStore = useSiswaStore.getState();

  const classIds = kelasStore.getByTeacher(teacherId).map((k) => k.id);
  return siswaStore.students
    .filter((s) => s.class_id !== null && classIds.includes(s.class_id) && s.is_active)
    .map((s) => ({
      ...s,
      kelas_name: s.class_name,
    }));
}

// ============================================================
// SISWA SELECTORS
// ============================================================

/**
 * Statistik untuk Dasbor Siswa.
 */
export function getSiswaDashboardStats(studentId: string, classId: string | null): SiswaDashboardStats {
  const akademikStore = useAkademikStore.getState();

  // Mata pelajaran unik dari jadwal kelas
  const schedules = classId ? akademikStore.getScheduleByClass(classId) : [];
  const mataPelajaran = new Set(schedules.map((s) => s.subject)).size;

  // Tugas aktif untuk kelas siswa
  const tugasAktif = classId
    ? akademikStore.getAssignmentByClass(classId).filter((a) => a.status === 'active').length
    : 0;

  // Rata-rata nilai
  const grades = akademikStore.getGradeByStudent(studentId);
  const rataRataNilai = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length)
    : 0;

  // Kehadiran
  const attendance = akademikStore.getAttendanceByStudent(studentId);
  const hadirCount = attendance.filter((a) => a.status === 'hadir').length;
  const kehadiran = attendance.length > 0
    ? Math.round((hadirCount / attendance.length) * 100)
    : 0;

  return { mataPelajaran, tugasAktif, rataRataNilai, kehadiran };
}

/**
 * Nilai siswa dengan relasi nama tugas.
 */
export function getSiswaGrades(studentId: string): GradeWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const siswaStore = useSiswaStore.getState();
  const assignments = akademikStore.assignments;

  const siswa = siswaStore.getById(studentId);
  return akademikStore.getGradeByStudent(studentId).map((g) => {
    const assignment = g.assignment_id
      ? assignments.find((a) => a.id === g.assignment_id)
      : null;
    return {
      ...g,
      student_name: siswa?.full_name ?? '',
      student_nis: siswa?.nis ?? '',
      assignment_title: assignment?.title ?? null,
    };
  });
}

/**
 * Tugas untuk siswa berdasarkan kelasnya.
 */
export function getSiswaAssignments(studentId: string, classId: string | null): AssignmentWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  if (!classId) return [];
  return akademikStore.getAssignmentByClass(classId).map((a) => {
    const kelas = kelasStore.getById(a.class_id);
    const guru = guruStore.getById(a.teacher_id);
    return {
      ...a,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? '',
    };
  });
}

/**
 * Jadwal kelas siswa.
 */
export function getSiswaSchedules(classId: string | null): ScheduleWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  if (!classId) return [];
  return akademikStore.getScheduleByClass(classId).map((s) => {
    const kelas = kelasStore.getById(s.class_id);
    const guru = guruStore.getById(s.teacher_id);
    return {
      ...s,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? '',
    };
  });
}

/**
 * Materi untuk kelas siswa.
 */
export function getSiswaMaterials(classId: string | null): MaterialWithRelations[] {
  const akademikStore = useAkademikStore.getState();
  const kelasStore = useKelasStore.getState();
  const guruStore = useGuruStore.getState();

  if (!classId) return [];
  return akademikStore.getMaterialByClass(classId).map((m) => {
    const kelas = kelasStore.getById(m.class_id);
    const guru = guruStore.getById(m.teacher_id);
    return {
      ...m,
      teacher_name: guru?.full_name ?? '',
      class_name: kelas?.name ?? '',
    };
  });
}

// ============================================================
// ORANG TUA SELECTORS
// ============================================================

/**
 * Statistik untuk Dasbor Orang Tua.
 */
export function getOrtuDashboardStats(childStudentId: string, classId: string | null): OrtuDashboardStats {
  const siswaStats = getSiswaDashboardStats(childStudentId, classId);
  return {
    rataRataNilai: siswaStats.rataRataNilai,
    kehadiran: siswaStats.kehadiran,
    tugasAktif: siswaStats.tugasAktif,
    tagihanTertunda: 0, // TODO: integrasi dengan modul pembayaran
  };
}

// ============================================================
// ADMIN SELECTORS (semua data)
// ============================================================

/**
 * Semua kelas dengan relasi lengkap untuk Admin.
 */
export function getAllKelasWithRelations(): KelasWithRelations[] {
  const kelasStore = useKelasStore.getState();
  const siswaStore = useSiswaStore.getState();
  const guruStore = useGuruStore.getState();

  return kelasStore.classes.map((k) => {
    const wali = k.wali_kelas_id ? guruStore.getById(k.wali_kelas_id) : null;
    const studentCount = siswaStore.students.filter(
      (s) => s.class_id === k.id && s.is_active
    ).length;
    const teacherCount = kelasStore.teacherClasses.filter(
      (tc) => tc.class_id === k.id
    ).length;
    return {
      ...k,
      wali_kelas_name: wali?.full_name ?? null,
      student_count: studentCount,
      teacher_count: teacherCount,
    };
  });
}

/**
 * Semua siswa dengan nama kelas untuk Admin.
 */
export function getAllSiswaWithKelas(): StudentWithKelas[] {
  return useSiswaStore.getState().getWithKelas();
}

/**
 * Semua pengumuman dengan info pembuat.
 */
export function getAllAnnouncementsWithAuthor(): AnnouncementWithAuthor[] {
  const pengumumanStore = usePengumumanStore.getState();
  const guruStore = useGuruStore.getState();
  const kelasStore = useKelasStore.getState();

  return pengumumanStore.announcements.map((a) => {
    const guru = a.created_by ? guruStore.getById(a.created_by) : null;
    const targetKelas = a.target_class_id ? kelasStore.getById(a.target_class_id) : null;
    return {
      ...a,
      author_name: guru?.full_name ?? 'Admin',
      target_class_name: targetKelas?.name ?? null,
    };
  });
}

// ============================================================
// INIT - fetch semua store sekaligus
// ============================================================

/**
 * Fetch semua data dari Supabase ke semua store.
 * Panggil saat aplikasi pertama kali dimuat (setelah login).
 */
export async function fetchAllData(): Promise<void> {
  await Promise.all([
    useGuruStore.getState().fetchAll(),
    useKelasStore.getState().fetchAll(),
    useSiswaStore.getState().fetchAll(),
    useAkademikStore.getState().fetchAll(),
    usePengumumanStore.getState().fetchAll(),
  ]);
}
