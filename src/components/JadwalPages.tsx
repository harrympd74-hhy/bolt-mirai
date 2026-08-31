import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Clock, MapPin, Plus, Edit3, Trash2, Loader2,
  CheckCircle2, XCircle, ArrowLeft, Search, BookOpen, User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule, Teacher, Kelas } from '@/types';

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

// ============================================================
// Jadwal Pembelajaran (List Page)
// ============================================================

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface ScheduleWithNames extends Schedule {
  teacher_name: string;
  class_name: string;
}

export function JadwalPembelajaranPage({ onAdd, onEdit }: { onAdd: () => void; onEdit: (s: ScheduleWithNames) => void }) {
  const [schedules, setSchedules] = useState<ScheduleWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [classes, setClasses] = useState<Kelas[]>([]);
  const { toasts, push, dismiss } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const [schedRes, teacherRes, classRes] = await Promise.all([
      supabase.from('schedules').select('*').order('day'),
      supabase.from('teachers').select('id, full_name'),
      supabase.from('classes').select('*').order('name'),
    ]);

    if (schedRes.error) {
      push('error', `Gagal memuat jadwal: ${schedRes.error.message}`);
      setLoading(false);
      return;
    }

    setClasses(classRes.data || []);
    const teacherMap = new Map((teacherRes.data || []).map((t: Pick<Teacher, 'id' | 'full_name'>) => [t.id, t.full_name]));
    const classMap = new Map((classRes.data || []).map((c: Kelas) => [c.id, c.name]));

    const enriched = (schedRes.data || []).map((s: Schedule) => ({
      ...s,
      teacher_name: teacherMap.get(s.teacher_id) || 'Tidak diketahui',
      class_name: classMap.get(s.class_id) || 'Tidak diketahui',
    }));

    setSchedules(enriched);
    setLoading(false);
  }, [push]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jadwal ini? Tindakan ini tidak dapat dibatalkan.')) return;
    const { error } = await supabase.from('schedules').delete().eq('id', id);
    if (error) push('error', `Gagal menghapus: ${error.message}`);
    else { push('success', 'Jadwal berhasil dihapus.'); load(); }
  };

  const filtered = schedules.filter((s) => {
    const matchSearch =
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.teacher_name.toLowerCase().includes(search.toLowerCase()) ||
      s.class_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.room || '').toLowerCase().includes(search.toLowerCase());
    const matchDay = filterDay === 'all' || s.day === filterDay;
    const matchClass = filterClass === 'all' || s.class_id === filterClass;
    return matchSearch && matchDay && matchClass;
  });

  // Group by day
  const byDay = DAYS.map((day) => ({
    day,
    items: filtered.filter((s) => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Jadwal Pembelajaran</h2>
          <p className="text-sm text-slate-500">{schedules.length} jadwal terdaftar</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Input Jadwal
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mapel, guru, kelas, ruang..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          />
        </div>
        <select
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <option value="all">Semua Hari</option>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <option value="all">Semua Kelas</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada jadwal yang sesuai filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {byDay.map(({ day, items }) => items.length > 0 && (
            <div key={day}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                {day}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{s.subject}</p>
                          <p className="text-xs text-slate-500">{s.class_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => onEdit(s)} className="text-slate-300 hover:text-emerald-600 transition-colors" aria-label="Edit jadwal">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 transition-colors" aria-label="Hapus jadwal">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {s.teacher_name}
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
// Input Jadwal (Form Page)
// ============================================================

export function InputJadwalPage({ onBack, editSchedule }: { onBack: () => void; editSchedule?: ScheduleWithNames | null }) {
  const isEdit = !!editSchedule;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [form, setForm] = useState({
    teacher_id: editSchedule?.teacher_id || '',
    class_id: editSchedule?.class_id || '',
    subject: editSchedule?.subject || '',
    day: editSchedule?.day || 'Senin',
    start_time: editSchedule?.start_time?.slice(0, 5) || '07:30',
    end_time: editSchedule?.end_time?.slice(0, 5) || '09:00',
    room: editSchedule?.room || '',
  });
  const [saving, setSaving] = useState(false);
  const { toasts, push, dismiss } = useToast();

  // Mata pelajaran yang diajar guru terpilih (dari field subject di tabel teachers)
  const selectedTeacher = teachers.find((t) => t.id === form.teacher_id);
  const teacherSubject = selectedTeacher?.subject || '';

  useEffect(() => {
    (async () => {
      const [tRes, cRes] = await Promise.all([
        supabase.from('teachers').select('*').eq('is_active', true).order('full_name'),
        supabase.from('classes').select('*').eq('is_active', true).order('name'),
      ]);
      setTeachers(tRes.data || []);
      setClasses(cRes.data || []);
    })();
  }, []);

  // Saat guru dipilih, otomatis isi mata pelajaran sesuai data guru
  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    setForm((prev) => ({
      ...prev,
      teacher_id: teacherId,
      subject: teacher?.subject || prev.subject,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teacher_id || !form.class_id || !form.subject.trim()) {
      push('error', 'Guru, kelas, dan mata pelajaran wajib diisi.');
      return;
    }
    if (form.start_time >= form.end_time) {
      push('error', 'Jam selesai harus lebih besar dari jam mulai.');
      return;
    }
    setSaving(true);
    const payload = {
      teacher_id: form.teacher_id,
      class_id: form.class_id,
      subject: form.subject.trim(),
      day: form.day,
      start_time: form.start_time,
      end_time: form.end_time,
      room: form.room.trim() || null,
    };
    let error;
    if (isEdit && editSchedule) {
      ({ error } = await supabase.from('schedules').update(payload).eq('id', editSchedule.id));
    } else {
      ({ error } = await supabase.from('schedules').insert(payload));
    }
    setSaving(false);
    if (error) {
      push('error', `Gagal menyimpan: ${error.message}`);
      return;
    }
    push('success', isEdit ? 'Jadwal berhasil diperbarui.' : 'Jadwal berhasil ditambahkan.');
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Jadwal Pembelajaran
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Jadwal' : 'Input Jadwal'}</h2>
            <p className="text-sm text-slate-500">{isEdit ? 'Perbarui jadwal pembelajaran' : 'Tambahkan jadwal pembelajaran baru'}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Guru" required>
              <select value={form.teacher_id} onChange={(e) => handleTeacherChange(e.target.value)} className="form-input">
                <option value="">Pilih guru...</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}{t.subject ? ` (${t.subject})` : ''}</option>)}
              </select>
            </Field>
            <Field label="Kelas" required>
              <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} className="form-input">
                <option value="">Pilih kelas...</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Mata Pelajaran" required>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder={teacherSubject ? `Sesuai guru: ${teacherSubject}` : 'Misal: Matematika'}
                className="form-input"
              />
              {teacherSubject && form.subject === teacherSubject && (
                <span className="text-xs text-emerald-600 mt-1 block">Otomatis terisi sesuai mata pelajaran guru</span>
              )}
            </Field>
            <Field label="Hari" required>
              <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="form-input">
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Jam Mulai" required>
              <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="form-input" />
            </Field>
            <Field label="Jam Selesai" required>
              <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="form-input" />
            </Field>
            <Field label="Ruang">
              <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Misal: R-101" className="form-input" />
            </Field>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isEdit ? 'Simpan Perubahan' : 'Simpan Jadwal'}
            </button>
            <button type="button" onClick={onBack} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
