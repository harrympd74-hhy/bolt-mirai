import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Clock, MapPin, BookOpen, Users, Loader2,
  CheckCircle2, XCircle, ArrowLeft, User,
  Check, X, HeartPulse, FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule, Student, Attendance } from '@/types';

type ToastType = { id: number; type: 'success' | 'error'; text: string };

function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const push = useCallback((type: ToastType['type'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, push, dismiss };
}

function ToastView({ toasts, onDismiss }: { toasts: ToastType[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${t.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'} text-white rounded-xl shadow-lg px-4 py-3 flex items-start gap-3`}
        >
          {t.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <p className="text-sm font-medium leading-snug flex-1">{t.text}</p>
          <button onClick={() => onDismiss(t.id)} className="text-white/80 hover:text-white shrink-0">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Helper: get today's day name in Indonesian
function getTodayName(): string {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const dayMap: Record<string, string> = {
    'Senin': 'Senin', 'Selasa': 'Selasa', 'Rabu': 'Rabu', 'Kamis': 'Kamis',
    'Jumat': 'Jumat', 'Sabtu': 'Sabtu', 'Minggu': 'Minggu',
    'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu',
    'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu',
  };
  return dayMap[today] || today;
}

// Helper: format time to HH:MM
function fmtTime(t: string): string {
  return t.slice(0, 5);
}

// ============================================================
// JADWAL MENGAJAR PAGE
// Menampilkan jadwal mengajar guru dari database (schedules table)
// Data ini sama dengan yang diinput admin di menu Jadwal
// ============================================================
export function JadwalMengajarPage({ teacherId }: { teacherId: string }) {
  const [schedules, setSchedules] = useState<(Schedule & { class_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const today = getTodayName();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes!inner(name)
      `)
      .eq('teacher_id', teacherId)
      .order('day')
      .order('start_time');

    if (error) {
      console.error('Gagal memuat jadwal:', error.message);
      setSchedules([]);
    } else {
      const enriched = (data || []).map((s: Schedule & { classes: { name: string } }) => ({
        ...s,
        class_name: s.classes?.name || 'Tidak diketahui',
      }));
      setSchedules(enriched);
    }
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  // Group by day
  const byDay = DAYS.map((day) => ({
    day,
    isToday: day === today,
    items: schedules.filter((s) => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Jadwal Mengajar</h2>
        <p className="text-sm text-slate-500">
          {schedules.length} jadwal mengajar terdaftar
          {today && <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium"><CalendarDays className="w-3.5 h-3.5" />Hari ini: {today}</span>}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada jadwal mengajar. Admin perlu menambahkan jadwal untuk Anda.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {byDay.map(({ day, isToday, items }) => items.length > 0 && (
            <div key={day}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-sm font-semibold ${isToday ? 'text-emerald-700' : 'text-slate-700'} flex items-center gap-2`}>
                  <CalendarDays className="w-4 h-4" />
                  {day}
                  {isToday && <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Hari Ini</span>}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${isToday ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{s.subject}</p>
                        <p className="text-xs text-slate-500">{s.class_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {fmtTime(s.start_time)} - {fmtTime(s.end_time)}
                      </span>
                      {s.room && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {s.room}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KELAS SAYA PAGE
// Menampilkan kelas aktif hari ini sesuai jadwal guru.
// Guru dapat melihat presensi siswa untuk setiap kelas/jadwal.
// ============================================================
export function KelasSayaPage({ teacherId }: { teacherId: string }) {
  const [todaySchedules, setTodaySchedules] = useState<(Schedule & { class_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<(Schedule & { class_name: string }) | null>(null);
  const today = getTodayName();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes!inner(name)
      `)
      .eq('teacher_id', teacherId)
      .eq('day', today)
      .order('start_time');

    if (error) {
      console.error('Gagal memuat jadwal hari ini:', error.message);
      setTodaySchedules([]);
    } else {
      const enriched = (data || []).map((s: Schedule & { classes: { name: string } }) => ({
        ...s,
        class_name: s.classes?.name || 'Tidak diketahui',
      }));
      setTodaySchedules(enriched);
    }
    setLoading(false);
  }, [teacherId, today]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Jika guru memilih jadwal tertentu, tampilkan halaman presensi
  if (selectedSchedule) {
    return (
      <PresensiSiswaPage
        schedule={selectedSchedule}
        teacherId={teacherId}
        onBack={() => setSelectedSchedule(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Kelas Saya Hari Ini</h2>
        <p className="text-sm text-slate-500">
          {todaySchedules.length} kelas aktif hari ini ({today})
        </p>
      </div>

      {todaySchedules.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Tidak ada kelas yang aktif hari ini. Nikmati hari libur Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todaySchedules.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSchedule(s)}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900">{s.subject}</p>
                  <p className="text-sm text-slate-500">{s.class_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-slate-700">{fmtTime(s.start_time)}</p>
                  <p className="text-xs text-slate-400">s/d {fmtTime(s.end_time)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {s.room && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {s.room}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Lihat Presensi
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-600 inline-flex items-center gap-1">
                  Buka Kelas <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRESENSI SISWA PAGE
// Guru dapat melihat dan mengisi presensi siswa untuk
// kelas dan jadwal yang dipilih.
// ============================================================
type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpha';

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; color: string; bg: string; border: string }> = {
  hadir: { label: 'Hadir', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  izin: { label: 'Izin', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-300' },
  sakit: { label: 'Sakit', icon: HeartPulse, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-300' },
  alpha: { label: 'Alpha', icon: X, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-300' },
};

export function PresensiSiswaPage({
  schedule,
  onBack,
}: {
  schedule: Schedule & { class_name: string };
  teacherId: string;
  onBack: () => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<string, Attendance>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toasts, push, dismiss } = useToast();

  const todayDate = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setLoading(true);
    // Ambil siswa di kelas ini
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', schedule.class_id)
      .eq('is_active', true)
      .order('full_name');

    if (studentError) {
      push('error', `Gagal memuat siswa: ${studentError.message}`);
      setLoading(false);
      return;
    }

    setStudents(studentData || []);

    // Ambil presensi yang sudah ada untuk hari ini
    const { data: attData } = await supabase
      .from('attendance')
      .select('*')
      .eq('class_id', schedule.class_id)
      .eq('date', todayDate);

    const attMap: Record<string, AttendanceStatus> = {};
    const existingMap: Record<string, Attendance> = {};
    (attData || []).forEach((a: Attendance) => {
      attMap[a.student_id] = a.status as AttendanceStatus;
      existingMap[a.student_id] = a;
    });
    setAttendanceMap(attMap);
    setExistingAttendance(existingMap);
    setLoading(false);
  }, [schedule.class_id, todayDate, push]);

  useEffect(() => { load(); }, [load]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    let savedCount = 0;
    let errorCount = 0;

    for (const student of students) {
      const status = attendanceMap[student.id];
      if (!status) continue;

      const existing = existingAttendance[student.id];
      try {
        if (existing) {
          // Update existing record
          const { error } = await supabase
            .from('attendance')
            .update({ status })
            .eq('id', existing.id);
          if (error) { errorCount++; console.error(error); }
          else savedCount++;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('attendance')
            .insert({
              student_id: student.id,
              class_id: schedule.class_id,
              date: todayDate,
              status,
            });
          if (error) { errorCount++; console.error(error); }
          else savedCount++;
        }
      } catch (err) {
        errorCount++;
        console.error(err);
      }
    }

    setSaving(false);
    if (errorCount > 0) {
      push('error', `${errorCount} gagal disimpan. ${savedCount} berhasil.`);
    } else {
      push('success', `Presensi ${savedCount} siswa berhasil disimpan.`);
    }
    // Reload to sync existing records
    load();
  };

  const markedCount = Object.keys(attendanceMap).length;
  const totalStudents = students.length;
  const hadirCount = Object.values(attendanceMap).filter((s) => s === 'hadir').length;
  const izinCount = Object.values(attendanceMap).filter((s) => s === 'izin').length;
  const sakitCount = Object.values(attendanceMap).filter((s) => s === 'sakit').length;
  const alphaCount = Object.values(attendanceMap).filter((s) => s === 'alpha').length;

  return (
    <div className="max-w-4xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Kelas Saya
      </button>

      {/* Header info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{schedule.subject}</h2>
            <p className="text-sm text-slate-500">
              {schedule.class_name} · {fmtTime(schedule.start_time)} - {fmtTime(schedule.end_time)}
              {schedule.room && ` · ${schedule.room}`}
            </p>
          </div>
        </div>

        {/* Summary badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryBadge label="Hadir" count={hadirCount} color="emerald" icon={Check} />
          <SummaryBadge label="Izin" count={izinCount} color="amber" icon={FileText} />
          <SummaryBadge label="Sakit" count={sakitCount} color="sky" icon={HeartPulse} />
          <SummaryBadge label="Alpha" count={alphaCount} color="rose" icon={X} />
        </div>
      </div>

      {/* Student list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada siswa terdaftar di kelas ini.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Daftar Siswa ({totalStudents})
              </p>
              <p className="text-xs text-slate-400">
                {markedCount} dari {totalStudents} sudah dipresensi
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {students.map((s, idx) => {
                const currentStatus = attendanceMap[s.id];
                return (
                  <div key={s.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                    <span className="text-xs text-slate-400 font-mono w-6 shrink-0">{idx + 1}</span>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{s.full_name}</p>
                      <p className="text-xs text-slate-400">NIS: {s.nis}</p>
                    </div>
                    {/* Status buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((status) => {
                        const cfg = STATUS_CONFIG[status];
                        const isActive = currentStatus === status;
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={status}
                            onClick={() => setStatus(s.id, status)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${
                              isActive
                                ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                            }`}
                            aria-label={`Tandai ${cfg.label}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={onBack}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={saveAttendance}
              disabled={saving || markedCount === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Simpan Presensi
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// SUMMARY BADGE
// ============================================================
function SummaryBadge({
  label, count, color, icon: Icon,
}: {
  label: string;
  count: number;
  color: 'emerald' | 'amber' | 'sky' | 'rose';
  icon: typeof Check;
}) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <div className={`rounded-lg border ${colors[color]} px-3 py-2 flex items-center gap-2`}>
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-lg font-bold leading-none">{count}</p>
        <p className="text-[10px] font-medium uppercase tracking-wide mt-0.5">{label}</p>
      </div>
    </div>
  );
}
