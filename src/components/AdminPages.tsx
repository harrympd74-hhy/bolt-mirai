import { useState, useEffect, useCallback } from 'react';
import {
  Users, GraduationCap, Search, Edit3, Trash2, Loader2,
  CheckCircle2, XCircle, UserPlus, Phone, Mail, BookOpen,
  ArrowLeft, ShieldCheck, KeyRound, AtSign, Eye, EyeOff,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================================
// Types
// ============================================================

export interface Teacher {
  id: string;
  nip: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  gender: string;
  username: string | null;
  password: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  class_name: string | null;
  gender: string;
  username: string | null;
  password: string | null;
  parent_username: string | null;
  parent_password: string | null;
  is_active: boolean;
  created_at: string;
}

type ToastType = { id: number; type: 'success' | 'error'; text: string };

// ============================================================
// Shared Toast
// ============================================================

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
// Admin Profile Page
// ============================================================

export function AdminProfilePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-700" />
        <div className="px-6 sm:px-8 pb-8 -mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white shrink-0">
              AR
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-xl font-bold text-slate-900">Ahmad Rizki</h2>
              <p className="text-sm text-slate-500">Pengelola Sistem MIRAI</p>
              <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Username" value="ahmad.rizki" />
            <InfoCard label="Email" value="ahmad.rizki@mirai.sch.id" />
            <InfoCard label="Nomor Telepon" value="0812-3456-7890" />
            <InfoCard label="Terakhir Login" value="20 Agustus 2026, 08:15" />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox label="Total Guru" value="3" icon={Users} tone="emerald" />
            <StatBox label="Total Siswa" value="4" icon={GraduationCap} tone="sky" />
            <StatBox label="Sistem Aktif" value="99.9%" icon={ShieldCheck} tone="amber" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Users; tone: 'emerald' | 'sky' | 'amber' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`rounded-xl ${tones[tone]} px-4 py-4 flex items-center gap-3`}>
      <Icon className="w-6 h-6" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

// ============================================================
// Teacher List Page
// ============================================================

export function TeacherListPage({ onAdd, onEdit }: { onAdd: () => void; onEdit: (t: Teacher) => void }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const { toasts, push, dismiss } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('teachers').select('*').order('full_name');
    if (error) push('error', `Gagal memuat data: ${error.message}`);
    else setTeachers(data || []);
    setLoading(false);
  }, [push]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus guru "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) push('error', `Gagal menghapus: ${error.message}`);
    else { push('success', 'Guru berhasil dihapus.'); load(); }
  };

  const filtered = teachers.filter((t) =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.nip.includes(search) ||
    (t.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar Guru</h2>
          <p className="text-sm text-slate-500">{teachers.length} guru terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showKeys ? 'Sembunyikan' : 'Tampilkan'} Sandi
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Input Data Guru
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NIP, atau mata pelajaran..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada data guru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{t.full_name}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${t.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {t.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">NIP: {t.nip}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  {t.subject && <span className="inline-flex items-center gap-1"><BookOpen className="w-3 h-3" />{t.subject}</span>}
                  {t.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{t.email}</span>}
                  {t.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{t.phone}</span>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs">
                  {t.username && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600">
                      <AtSign className="w-3 h-3" />{t.username}
                    </span>
                  )}
                  {t.password && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600">
                      <KeyRound className="w-3 h-3" />
                      {showKeys ? t.password : '••••••••'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onEdit(t)}
                  className="text-slate-300 hover:text-emerald-600 transition-colors"
                  aria-label="Edit guru"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.full_name)}
                  className="text-slate-300 hover:text-rose-600 transition-colors"
                  aria-label="Hapus guru"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Teacher Input Page
// ============================================================

export function TeacherInputPage({ onBack, editTeacher }: { onBack: () => void; editTeacher?: Teacher | null }) {
  const isEdit = !!editTeacher;
  const [form, setForm] = useState({
    nip: editTeacher?.nip || '', full_name: editTeacher?.full_name || '',
    email: editTeacher?.email || '', phone: editTeacher?.phone || '',
    subject: editTeacher?.subject || '', gender: editTeacher?.gender || 'L',
    username: editTeacher?.username || '', password: editTeacher?.password || '',
  });
  const [saving, setSaving] = useState(false);
  const { toasts, push, dismiss } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nip.trim() || !form.full_name.trim()) {
      push('error', 'NIP dan Nama Lengkap wajib diisi.');
      return;
    }
    if (!form.username.trim() || !form.password.trim()) {
      push('error', 'Username dan Password wajib diisi untuk login guru.');
      return;
    }
    setSaving(true);
    const payload = {
      nip: form.nip.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      gender: form.gender,
      username: form.username.trim(),
      password: form.password.trim(),
    };
    let error;
    if (isEdit && editTeacher) {
      ({ error } = await supabase.from('teachers').update(payload).eq('id', editTeacher.id));
    } else {
      ({ error } = await supabase.from('teachers').insert({ ...payload, is_active: true }));
    }
    setSaving(false);
    if (error) {
      push('error', `Gagal menyimpan: ${error.message}`);
      return;
    }
    push('success', isEdit ? 'Data guru berhasil diperbarui.' : 'Data guru berhasil ditambahkan.');
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Guru
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Input Data Guru</h2>
            <p className="text-sm text-slate-500">Tambahkan guru baru ke sistem MIRAI</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="NIP" required>
              <input value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} placeholder="Nomor Induk Pegawai" className="form-input" />
            </Field>
            <Field label="Nama Lengkap" required>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nama lengkap guru" className="form-input" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@sekolah.sch.id" className="form-input" />
            </Field>
            <Field label="Nomor Telepon">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="form-input" />
            </Field>
            <Field label="Mata Pelajaran">
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Misal: Matematika" className="form-input" />
            </Field>
            <Field label="Jenis Kelamin">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="form-input">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </Field>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-4">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Akun Login Guru
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Username" required>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username untuk login guru" className="form-input" />
              </Field>
              <Field label="Password" required>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Kata sandi untuk login guru" className="form-input" />
              </Field>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isEdit ? 'Simpan Perubahan' : 'Simpan Data Guru'}
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

// ============================================================
// Student List Page
// ============================================================

export function StudentListPage({ onAdd, onEdit }: { onAdd: () => void; onEdit: (s: Student) => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const { toasts, push, dismiss } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('full_name');
    if (error) push('error', `Gagal memuat data: ${error.message}`);
    else setStudents(data || []);
    setLoading(false);
  }, [push]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus siswa "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) push('error', `Gagal menghapus: ${error.message}`);
    else { push('success', 'Siswa berhasil dihapus.'); load(); }
  };

  const filtered = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.includes(search) ||
    (s.class_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar Siswa</h2>
          <p className="text-sm text-slate-500">{students.length} siswa terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showKeys ? 'Sembunyikan' : 'Tampilkan'} Sandi
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Input Data Siswa
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NIS, atau kelas..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada data siswa.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">NIS</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">Nama</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">Kelas</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">L/P</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">Kontak</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">User Siswa</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">Sandi Siswa</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">User Ortu</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">Sandi Ortu</th>
                  <th className="text-center font-semibold text-slate-600 px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{s.nis}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.class_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{s.gender === 'L' ? 'L' : 'P'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{s.phone || s.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{s.username || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{s.password ? (showKeys ? s.password : '••••••') : '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{s.parent_username || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{s.parent_password ? (showKeys ? s.parent_password : '••••••') : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => onEdit(s)} className="text-slate-300 hover:text-sky-600 transition-colors" aria-label="Edit siswa">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id, s.full_name)} className="text-slate-300 hover:text-rose-600 transition-colors" aria-label="Hapus siswa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Student Input Page
// ============================================================

export function StudentInputPage({ onBack, editStudent }: { onBack: () => void; editStudent?: Student | null }) {
  const isEdit = !!editStudent;
  const [form, setForm] = useState({
    nis: editStudent?.nis || '', full_name: editStudent?.full_name || '',
    email: editStudent?.email || '', phone: editStudent?.phone || '',
    class_name: editStudent?.class_name || '', gender: editStudent?.gender || 'L',
    username: editStudent?.username || '', password: editStudent?.password || '',
    parent_username: editStudent?.parent_username || '', parent_password: editStudent?.parent_password || '',
  });
  const [saving, setSaving] = useState(false);
  const { toasts, push, dismiss } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nis.trim() || !form.full_name.trim()) {
      push('error', 'NIS dan Nama Lengkap wajib diisi.');
      return;
    }
    if (!form.username.trim() || !form.password.trim()) {
      push('error', 'Username dan Password siswa wajib diisi.');
      return;
    }
    if (!form.parent_username.trim() || !form.parent_password.trim()) {
      push('error', 'Username dan Password orang tua wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      nis: form.nis.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      class_name: form.class_name.trim() || null,
      gender: form.gender,
      username: form.username.trim(),
      password: form.password.trim(),
      parent_username: form.parent_username.trim(),
      parent_password: form.parent_password.trim(),
    };
    let error;
    if (isEdit && editStudent) {
      ({ error } = await supabase.from('students').update(payload).eq('id', editStudent.id));
    } else {
      ({ error } = await supabase.from('students').insert({ ...payload, is_active: true }));
    }
    setSaving(false);
    if (error) {
      push('error', `Gagal menyimpan: ${error.message}`);
      return;
    }
    push('success', isEdit ? 'Data siswa berhasil diperbarui.' : 'Data siswa berhasil ditambahkan.');
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToastView toasts={toasts} onDismiss={dismiss} />
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Siswa
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            {isEdit ? <Edit3 className="w-5 h-5 text-sky-600" /> : <UserPlus className="w-5 h-5 text-sky-600" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Data Siswa' : 'Input Data Siswa'}</h2>
            <p className="text-sm text-slate-500">{isEdit ? 'Perbarui data siswa di sistem MIRAI' : 'Tambahkan siswa baru ke sistem MIRAI'}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="NIS" required>
              <input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} placeholder="Nomor Induk Siswa" className="form-input" />
            </Field>
            <Field label="Nama Lengkap" required>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nama lengkap siswa" className="form-input" />
            </Field>
            <Field label="Kelas">
              <input value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} placeholder="Misal: IX-A" className="form-input" />
            </Field>
            <Field label="Jenis Kelamin">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="form-input">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </Field>
            <Field label="Email Wali">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email wali siswa" className="form-input" />
            </Field>
            <Field label="Nomor Telepon Wali">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="form-input" />
            </Field>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-4">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-sky-600" />
              Akun Login Siswa
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Username Siswa" required>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username untuk login siswa" className="form-input" />
              </Field>
              <Field label="Password Siswa" required>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Kata sandi untuk login siswa" className="form-input" />
              </Field>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-4">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-teal-600" />
              Akun Login Orang Tua
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Username Orang Tua" required>
                <input value={form.parent_username} onChange={(e) => setForm({ ...form, parent_username: e.target.value })} placeholder="Username untuk login orang tua" className="form-input" />
              </Field>
              <Field label="Password Orang Tua" required>
                <input value={form.parent_password} onChange={(e) => setForm({ ...form, parent_password: e.target.value })} placeholder="Kata sandi untuk login orang tua" className="form-input" />
              </Field>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isEdit ? 'Simpan Perubahan' : 'Simpan Data Siswa'}
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

// ============================================================
// Shared Field component
// ============================================================

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
