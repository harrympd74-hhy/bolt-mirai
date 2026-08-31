import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CalendarDays, Clock, MapPin, BookOpen, Loader2, User,
  ArrowLeft, ChevronRight, Sparkles, Lightbulb, Users,
  ClipboardList, Search, Send, Bot, AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule, Student } from '@/types';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

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

function fmtTime(t: string): string {
  return t.slice(0, 5);
}

// ============================================================
// RUANG KELAS - kelas aktif hari ini sesuai jadwal siswa
// Terhubung ke Jadwal Saya: menampilkan jadwal aktif hari ini
// ============================================================
export function RuangKelasPage({ studentId, classId, onShowMeetings }: { studentId: string; classId: string | null; onShowMeetings?: () => void }) {
  const [todaySchedules, setTodaySchedules] = useState<(Schedule & { teacher_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<(Schedule & { teacher_name: string }) | null>(null);
  const today = getTodayName();

  const load = useCallback(async () => {
    setLoading(true);
    if (!classId) {
      setTodaySchedules([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        teachers!inner(full_name)
      `)
      .eq('class_id', classId)
      .eq('day', today)
      .order('start_time');

    if (error) {
      console.error('Gagal memuat jadwal:', error.message);
      setTodaySchedules([]);
    } else {
      const enriched = (data || []).map((s: Schedule & { teachers: { full_name: string } }) => ({
        ...s,
        teacher_name: s.teachers?.full_name || 'Tidak diketahui',
      }));
      setTodaySchedules(enriched);
    }
    setLoading(false);
  }, [classId, today]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (selectedSchedule) {
    return (
      <RuangKelasDetail
        schedule={selectedSchedule}
        studentId={studentId}
        onBack={() => setSelectedSchedule(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ruang Kelas</h2>
            <p className="text-sm text-slate-500">
              {todaySchedules.length} mata pelajaran aktif hari ini ({today})
            </p>
          </div>
          {onShowMeetings && (
            <button
              onClick={onShowMeetings}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 px-3 py-2 text-sm font-medium hover:bg-sky-100 transition-colors"
            >
              <CalendarDays className="w-4 h-4" /> Lihat Pertemuan
            </button>
          )}
        </div>
      </div>

      {todaySchedules.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Tidak ada kelas yang aktif hari ini. Selamat menikmati hari libur!</p>
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
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900">{s.subject}</p>
                  <p className="text-sm text-slate-500">{s.teacher_name}</p>
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
                    <Clock className="w-3.5 h-3.5" />
                    {today}
                  </span>
                </div>
                <span className="text-xs font-medium text-sky-600 inline-flex items-center gap-1">
                  Masuk Kelas <ChevronRight className="w-3.5 h-3.5" />
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
// RUANG KELAS DETAIL - detail mata pelajaran yang dipilih
// ============================================================
function RuangKelasDetail({
  schedule,
  studentId,
  onBack,
}: {
  schedule: Schedule & { teacher_name: string };
  studentId: string;
  onBack: () => void;
}) {
  const [classmates, setClassmates] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', schedule.class_id)
        .eq('is_active', true)
        .order('full_name');
      setClassmates(data || []);
      setLoading(false);
    })();
  }, [schedule.class_id]);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Ruang Kelas
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-sky-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{schedule.subject}</h2>
            <p className="text-sm text-slate-500">
              {schedule.teacher_name} · {fmtTime(schedule.start_time)} - {fmtTime(schedule.end_time)}
              {schedule.room && ` · ${schedule.room}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4.5 h-4.5 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-700">Teman Sekelas</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-sky-600 animate-spin" /></div>
          ) : classmates.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">Belum ada data teman sekelas.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {classmates.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2.5 py-1.5">
                  <span className="text-xs text-slate-400 font-mono w-5 shrink-0">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{s.full_name}</p>
                    <p className="text-xs text-slate-400">NIS: {s.nis}</p>
                  </div>
                  {s.id === studentId && (
                    <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Anda</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-700">Info Mata Pelajaran</h3>
          </div>
          <div className="space-y-3">
            <InfoRow icon={BookOpen} label="Mata Pelajaran" value={schedule.subject} />
            <InfoRow icon={User} label="Guru Pengampu" value={schedule.teacher_name} />
            <InfoRow icon={Clock} label="Jam" value={`${fmtTime(schedule.start_time)} - ${fmtTime(schedule.end_time)}`} />
            <InfoRow icon={CalendarDays} label="Hari" value={schedule.day} />
            {schedule.room && <InfoRow icon={MapPin} label="Ruang" value={schedule.room} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-slate-500 w-28 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}

// ============================================================
// JADWAL SAYA - jadwal lengkap siswa dari database
// ============================================================
export function JadwalSayaPage({ classId }: { classId: string | null }) {
  const [schedules, setSchedules] = useState<(Schedule & { teacher_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const today = getTodayName();

  const load = useCallback(async () => {
    setLoading(true);
    if (!classId) {
      setSchedules([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        teachers!inner(full_name)
      `)
      .eq('class_id', classId)
      .order('day')
      .order('start_time');

    if (error) {
      console.error('Gagal memuat jadwal:', error.message);
      setSchedules([]);
    } else {
      const enriched = (data || []).map((s: Schedule & { teachers: { full_name: string } }) => ({
        ...s,
        teacher_name: s.teachers?.full_name || 'Tidak diketahui',
      }));
      setSchedules(enriched);
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => { load(); }, [load]);

  const byDay = DAYS.map((day) => ({
    day,
    isToday: day === today,
    items: schedules.filter((s) => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Jadwal Saya</h2>
        <p className="text-sm text-slate-500">
          {schedules.length} jadwal pelajaran terdaftar
          {today && <span className="ml-2 inline-flex items-center gap-1 text-sky-600 font-medium"><CalendarDays className="w-3.5 h-3.5" />Hari ini: {today}</span>}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada jadwal untuk kelas Anda. Hubungi admin sekolah.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {byDay.map(({ day, isToday, items }) => items.length > 0 && (
            <div key={day}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-sm font-semibold ${isToday ? 'text-sky-700' : 'text-slate-700'} flex items-center gap-2`}>
                  <CalendarDays className="w-4 h-4" />
                  {day}
                  {isToday && <span className="text-[10px] font-bold uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Hari Ini</span>}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${isToday ? 'border-sky-300 ring-1 ring-sky-200' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{s.subject}</p>
                        <p className="text-xs text-slate-500">{s.teacher_name}</p>
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
// JENDELA ILMU - sumber belajar & pengetahuan
// ============================================================
export function JendelaIlmuPage({ onOpenTutor }: { onOpenTutor?: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Jendela Ilmu</h2>
        <p className="text-sm text-slate-500">Pusat pengetahuan dan sumber belajar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">AI Tutor</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Belajar dengan bantuan AI Tutor yang siap menjawab pertanyaan dan membantu memahami materi pelajaran.
          </p>
          {onOpenTutor ? (
            <button onClick={onOpenTutor} className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors">
              <Sparkles className="w-4 h-4" /> Mulai Bertanya
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Segera Hadir
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Materi Pembelajaran</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Akses materi dan modul pelajaran yang diunggah oleh guru sesuai mata pelajaran Anda.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Segera Hadir
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Tugas & Latihan</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Kerjakan tugas dan latihan dari guru, lalu kumpulkan langsung melalui portal MIRAI.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Segera Hadir
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-violet-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Pustaka Digital</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Jelajahi koleksi buku digital, jurnal, dan referensi pendidikan untuk memperluas wawasan.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Segera Hadir
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RUANG KOLABORASI - Kelompok Belajar
// ============================================================
export function KelompokBelajarPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Kelompok Belajar</h2>
        <p className="text-sm text-slate-500">Bergabung dan kolaborasi dengan teman dalam kelompok belajar</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-5">
          <Users className="w-8 h-8 text-sky-600" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-2">Kelompok Belajar</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
          Fitur kelompok belajar akan segera hadir. Anda akan dapat membuat kelompok,
          mengajak teman, dan belajar bersama secara kolaboratif.
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-sky-50 text-sky-600">
          <Sparkles size={15} /> Segera Hadir
        </span>
      </div>
    </div>
  );
}

// ============================================================
// RUANG KOLABORASI - Tugas Kelompok
// ============================================================
export function TugasKelompokPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Tugas Kelompok</h2>
        <p className="text-sm text-slate-500">Kelola dan kerjakan tugas kelompok bersama tim</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <ClipboardList className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-2">Tugas Kelompok</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
          Fitur tugas kelompok akan segera hadir. Anda akan dapat menerima tugas kelompok,
          berdiskusi dengan anggota tim, dan mengumpulkan hasil kerja bersama.
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-50 text-amber-600">
          <Sparkles size={15} /> Segera Hadir
        </span>
      </div>
    </div>
  );
}

// ============================================================
// AI TUTOR - chat dengan AI yang dikonfigurasi admin
// ============================================================
interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'Jelaskan apa itu ekosistem',
  'Bagaimana cara mencari akar persamaan kuadrat?',
  'Apa perbedaan tata surya dan galaksi?',
  'Bantu aku pahami tekanan dan zat cair',
];

export function AiTutorPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data, error: dbError } = await supabase
        .from('ai_providers')
        .select('is_active, api_key, expires_at')
        .eq('is_active', true)
        .maybeSingle();

      if (dbError || !data || !data.api_key || data.api_key.trim() === '') {
        setProviderStatus('unavailable');
        return;
      }
      if (data.expires_at) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(data.expires_at) < today) {
          setProviderStatus('unavailable');
          return;
        }
      }
      setProviderStatus('ready');
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending || providerStatus !== 'ready') return;

    setError(null);
    const userMsg: ChatMsg = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor-chat`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errMsg = data.error || `Gagal menghubungi AI Tutor (${response.status})`;
        setError(errMsg);
        return;
      }

      if (!data.reply || typeof data.reply !== 'string') {
        setError('Format respons AI tidak valid.');
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke server.';
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Tutor</h2>
        </div>
        <p className="text-sm text-slate-500">Tanyakan apa saja seputar materi pelajaran. AI Tutor siap membantu belajar.</p>
      </div>

      {providerStatus === 'checking' && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
        </div>
      )}

      {providerStatus === 'unavailable' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-amber-900 mb-2">AI Tutor belum tersedia</h3>
          <p className="text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
            Admin belum mengatur API Key AI. Mintalah admin untuk membuka halaman <strong>AI Connector</strong> dan menginputkan API Key dari salah satu provider (Claude, GPT, atau Gemini) untuk mengaktifkan AI Tutor.
          </p>
        </div>
      )}

      {providerStatus === 'ready' && (
        <>
          <div ref={scrollRef} className="rounded-2xl border border-slate-200 bg-white overflow-y-auto" style={{ maxHeight: '60vh', minHeight: '300px' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Halo! Saya MIRAI Tutor</h3>
                <p className="text-sm text-slate-500 mb-5 max-w-sm">Saya siap membantu kamu belajar. Coba salah satu pertanyaan di bawah atau ketik pertanyaanmu sendiri.</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sky-100' : 'bg-amber-100'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-sky-600" /> : <Bot className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className={`rounded-xl px-4 py-2.5 max-w-[80%] ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="rounded-xl px-4 py-2.5 bg-slate-100">
                      <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="mt-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaanmu di sini..."
              disabled={sending}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl bg-amber-600 text-white px-4 py-3 flex items-center gap-1.5 text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> Kirim
            </button>
          </form>
        </>
      )}
    </div>
  );
}
