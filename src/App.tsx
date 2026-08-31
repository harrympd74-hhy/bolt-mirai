import { FormEvent, useState } from 'react';
import AIConnectorPage from '@/components/AIConnectorPage';
import { AdminProfilePage, TeacherListPage, TeacherInputPage, StudentListPage, StudentInputPage } from '@/components/AdminPages';
import { JadwalPembelajaranPage, InputJadwalPage } from '@/components/JadwalPages';
import { JadwalMengajarPage, KelasSayaPage } from '@/components/GuruPages';
import { TamuDashboard } from '@/components/TamuPages';
import { RuangKelasPage, JadwalSayaPage, JendelaIlmuPage, KelompokBelajarPage, TugasKelompokPage, AiTutorPage } from '@/components/SiswaPages';
import { BahanAjarPage, KumpulanSoalPage, KumpulanAngketPage, PersiapanKelasPage } from '@/components/RuangPerencanaanPages';
import { PertemuanKelasPage, SiswaMeetingView } from '@/components/PertemuanKelasPage';
import type { Teacher, Student } from '@/components/AdminPages';
import type { Schedule } from '@/types';
import { Clock, MapPin, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDashboardData, useGuruDashboardData, useSiswaDashboardData, useOrtuDashboardData, useTamuDashboardData } from '@/hooks/useDashboardData';
import {
  Activity, ArrowRight, BarChart3, Bell, BookOpen, Bot, CalendarDays, ChevronDown,
  CircleUserRound, CreditCard, Eye, EyeOff, FileText, GraduationCap, Images,
  LayoutDashboard, LockKeyhole, LogOut, Menu, Moon, Newspaper, Search,
  Settings, ShieldCheck, Users, X, ClipboardList, Award, TrendingUp,
  UserPlus, ChevronRight, Plus, Loader2, Lightbulb,
} from 'lucide-react';

const imageBase = 'https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201';

const adminRole = { title: 'Admin', key: 'admin' as const, description: 'Kelola seluruh sistem MIRAI', image: `${imageBase}/03d27ec3-8a8f-4d.png`, accent: '#1e6f5c' };

const roles = [
  { title: 'Guru', key: 'guru', description: 'Kelola pembelajaran & administrasi kelas', image: `${imageBase}/798ab757-3198-4d.png`, accent: '#0daaa0' },
  { title: 'Siswa', key: 'siswa', description: 'Belajar dengan AI Tutor & pantau progres', image: `${imageBase}/efd9f1e7-bf3f-49.png`, accent: '#39a9dc' },
  { title: 'Orang Tua', key: 'ortu', description: 'Pantau perkembangan anak secara realtime', image: `${imageBase}/340e34d8-5045-4b.png`, accent: '#8b6de1' },
  { title: 'Tamu', key: 'tamu', description: 'Akses informasi & laporan sekolah', image: `${imageBase}/f026320c-1d02-4c.png`, accent: '#335c67' },
] as const;

type Role = (typeof roles)[number];
type RoleKey = Role['key'] | 'admin';
type LoginRole = { title: string; key: string; description: string; image: string; accent: string };

const team = [
  { name: 'Prof. Dr.H. Tatang Herman, M.Ed.', role: 'Promotor', image: 'https://cdn.enter.pro/resources/uid_100054821/28afbca4-8ad2-4d.png' },
  { name: 'Prof. Dr. H. Sufyani Prabawanto, M.Ed.', role: 'Ko-Promotor 1', image: 'https://cdn.enter.pro/resources/uid_100054821/3eeb0c02-89cc-40.png' },
  { name: 'Prof. Al Jupri, S.Pd., M.Sc., Ph.D.', role: 'Ko-Promotor 2', image: 'https://cdn.enter.pro/resources/uid_100054821/3d6251a9-2096-41.png' },
  { name: 'Yuni Suryaningsih', role: 'Peneliti', image: `${imageBase}/e6b0c657-762d-49.png` },
];

type MenuItem = { label: string; icon: typeof LayoutDashboard; submenu?: { label: string; icon: typeof LayoutDashboard }[] };

// ============================================================
// SIDEBAR MENUS
// Menu yang sudah terhubung ke database ditandai dengan label yang aktif.
// Menu yang belum siap akan menampilkan halaman "segera hadir".
// ============================================================
const roleMenus: Record<RoleKey, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Profil Admin', icon: CircleUserRound },
    {
      label: 'Data Guru', icon: Users, submenu: [
        { label: 'Daftar Guru', icon: Users },
        { label: 'Input Data Guru', icon: UserPlus },
      ],
    },
    {
      label: 'Data Siswa', icon: GraduationCap, submenu: [
        { label: 'Daftar Siswa', icon: GraduationCap },
        { label: 'Input Data Siswa', icon: UserPlus },
      ],
    },
    {
      label: 'Jadwal', icon: CalendarDays, submenu: [
        { label: 'Jadwal Pembelajaran', icon: CalendarDays },
        { label: 'Input Jadwal', icon: Plus },
      ],
    },
    { label: 'AI Connector', icon: Bot },
    { label: 'Pengaturan', icon: Settings },
  ],
  guru: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Kelas Saya', icon: BookOpen },
    {
      label: 'Ruang Perencanaan', icon: ClipboardList, submenu: [
        { label: 'Pertemuan Kelas', icon: CalendarDays },
        { label: 'Persiapan Kelas', icon: CalendarDays },
        { label: 'Bahan Ajar', icon: BookOpen },
        { label: 'Kumpulan Soal', icon: FileText },
        { label: 'Kumpulan Angket', icon: ClipboardList },
      ],
    },
    { label: 'Penilaian', icon: Award },
    { label: 'Jadwal Mengajar', icon: CalendarDays },
    { label: 'Pengaturan', icon: Settings },
  ],
  siswa: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Ruang Kelas', icon: BookOpen },
    { label: 'Pertemuan Saya', icon: CalendarDays },
    { label: 'Jendela Ilmu', icon: ClipboardList },
    {
      label: 'Ruang Kolaborasi', icon: Award, submenu: [
        { label: 'Kelompok Belajar', icon: Users },
        { label: 'Tugas Kelompok', icon: ClipboardList },
      ],
    },
    { label: 'AI Tutor', icon: Lightbulb },
    { label: 'Jadwal Saya', icon: CalendarDays },
    { label: 'Pengaturan', icon: Settings },
  ],
  ortu: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Perkembangan Anak', icon: TrendingUp },
    { label: 'Absensi', icon: CalendarDays },
    { label: 'Nilai', icon: Award },
    { label: 'Pembayaran', icon: CreditCard },
    { label: 'Pengaturan', icon: Settings },
  ],
  tamu: [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Informasi Sekolah', icon: FileText },
    { label: 'Berita & Pengumuman', icon: Newspaper },
    { label: 'Galeri', icon: Images },
    { label: 'Kontak', icon: Users },
  ],
};

// ============================================================
// SESSION TYPE - menyimpan profil real dari database
// ============================================================
interface SessionData {
  key: RoleKey;
  accent: string;
  profile: {
    id: string;
    name: string;
    sub: string;
    badge: string;
    teacherId?: string;
    studentId?: string;
    childStudentId?: string;
    classId?: string | null;
  };
}

// ============================================================
// LOGIN MODAL - cek database untuk guru/siswa/ortu
// ============================================================
function LoginModal({ role, onClose, onSuccess }: { role: LoginRole; onClose: () => void; onSuccess: (session: SessionData) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const result = await login(username.trim(), password, role.key as 'admin' | 'guru' | 'siswa' | 'ortu');
    if (!result.success) {
      setError(result.error);
      return;
    }
    const badgeMap: Record<string, string> = {
      admin: 'ADMINISTRATOR',
      guru: 'GURU',
      siswa: 'SISWA',
      ortu: 'ORANG TUA',
      tamu: 'TAMU',
    };
    onSuccess({
      key: result.role as RoleKey,
      accent: role.accent,
      profile: {
        id: result.profile.id,
        name: result.profile.name,
        sub: result.profile.sub,
        badge: badgeMap[result.role] || result.role.toUpperCase(),
        teacherId: result.profile.teacherId,
        studentId: result.profile.studentId,
        childStudentId: result.profile.childStudentId,
        classId: result.profile.classId ?? null,
      },
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="login-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-accent" style={{ background: role.accent }} />
        <div className="modal-heading">
          <div className="role-avatar small" style={{ borderColor: role.accent }}><img src={role.image} alt="" /></div>
          <div><span>Masuk sebagai</span><h2>{role.title}</h2></div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Tutup"><X size={19} /></button>
        </div>
        <form onSubmit={submit} className="login-form">
          <label>Username<input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username / NISN / NIP" disabled={loading} /></label>
          <label>Kata Sandi<div className="password-field"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan kata sandi" disabled={loading} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Tampilkan kata sandi">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          {error && <p className="form-error">{error}</p>}
          <button className="login-button" style={{ background: role.accent }} type="submit" disabled={loading}>
            {loading ? <Loader2 size={17} className="animate-spin" /> : <>Masuk ke Sistem <ArrowRight size={17} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD - semua data real dari database
// ============================================================
function Dashboard({ roleKey, accent, profile, onLogout }: { roleKey: RoleKey; accent: string; profile: SessionData['profile']; onLogout: () => void }) {
  const menu = roleMenus[roleKey];
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editSchedule, setEditSchedule] = useState<(Schedule & { teacher_name: string; class_name: string }) | null>(null);

  // Data real dari database
  const adminData = useAdminDashboardData();
  const guruData = useGuruDashboardData(profile.teacherId || '');
  const siswaData = useSiswaDashboardData(profile.studentId || '', profile.classId ?? null);
  const ortuData = useOrtuDashboardData(profile.childStudentId || '', profile.classId ?? null);
  const tamuData = useTamuDashboardData();

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // ============================================================
  // Stat cards per role (data real)
  // ============================================================
  const stats = getStatsForRole(roleKey, { adminData, guruData, siswaData, ortuData, tamuData });
  const activities = getActivitiesForRole(roleKey, { adminData });

  return (
    <main className="admin-dashboard">
      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`} style={{ background: `linear-gradient(165deg, ${accent} 0%, ${shade(accent, -25)} 46%, ${shade(accent, -35)} 100%)` }}>
        <div className="sidebar-brand">
          <img src={`${imageBase}/03d27ec3-8a8f-4d.png`} alt="Logo UPI" />
          <div><strong>MIRAI</strong><span>{roleKey === 'admin' ? 'Portal Admin' : `Portal ${profile.badge.charAt(0) + profile.badge.slice(1).toLowerCase()}`}</span></div>
        </div>
        <div className="admin-profile"><span>{profile.badge}</span><strong>{profile.name}</strong><small>{profile.sub}</small></div>
        <nav className="admin-nav" aria-label="Navigasi">
          {menu.map((item) => {
            const hasSub = !!item.submenu;
            const isExpanded = expandedMenus.has(item.label);
            const isSubActive = item.submenu?.some((s) => s.label === activeMenu);
            return (
              <div key={item.label}>
                <button
                  type="button"
                  className={`${(activeMenu === item.label || isSubActive) ? 'active' : ''}`}
                  onClick={() => {
                    if (hasSub) toggleSubmenu(item.label);
                    else { setActiveMenu(item.label); setMenuOpen(false); }
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {hasSub && (
                    <ChevronRight size={14} className={`ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  )}
                </button>
                {hasSub && isExpanded && (
                  <div className="ml-6 mt-1 flex flex-col gap-0.5">
                    {item.submenu!.map((sub) => (
                      <button
                        type="button"
                        key={sub.label}
                        className={`text-sm py-1.5 px-3 rounded-lg text-left flex items-center gap-2 transition-colors ${activeMenu === sub.label ? 'text-white bg-white/15 font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        onClick={() => { setActiveMenu(sub.label); setMenuOpen(false); }}
                      >
                        <sub.icon size={15} />
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <button type="button" className="sidebar-logout" onClick={onLogout}><LogOut size={18} /><span>Keluar</span></button>
      </aside>
      <section className="admin-main">
        <header className="admin-header">
          <div className="header-title"><button type="button" className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu"><Menu size={20} /></button><div><span>{profile.badge}</span><h1>{activeMenu}</h1></div></div>
          <div className="header-actions"><div className="admin-search"><Search size={17} /><input placeholder="Cari data..." aria-label="Cari data" /></div><button type="button" aria-label="Mode gelap"><Moon size={18} /></button><button type="button" className="notification-button" aria-label="Notifikasi"><Bell size={18} /><b>3</b></button><button type="button" aria-label="Keluar" onClick={onLogout}><LogOut size={18} /></button></div>
        </header>
        <div className="admin-content">
          {renderContent(roleKey, activeMenu, {
            accent, profile, stats, activities,
            adminData, guruData, siswaData, ortuData, tamuData,
            setActiveMenu, setEditTeacher, setEditStudent, setEditSchedule,
            editTeacher, editStudent, editSchedule,
          })}
        </div>
      </section>
    </main>
  );
}

// ============================================================
// SISWA JADWAL MINGGUAN - widget jadwal 1 minggu di dashboard siswa
// ============================================================
const SISWA_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getTodayNameId(): string {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const dayMap: Record<string, string> = {
    'Senin': 'Senin', 'Selasa': 'Selasa', 'Rabu': 'Rabu', 'Kamis': 'Kamis',
    'Jumat': 'Jumat', 'Sabtu': 'Sabtu', 'Minggu': 'Minggu',
    'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu',
    'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu',
  };
  return dayMap[today] || today;
}

function SiswaJadwalMingguan({ schedules }: { schedules: (Schedule & { teacher_name: string })[] }) {
  const today = getTodayNameId();
  const byDay = SISWA_DAYS.map((day) => ({
    day,
    isToday: day === today,
    items: schedules
      .filter((s) => s.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={18} className="text-sky-600" />
        <h3 className="text-sm font-bold text-slate-800">Jadwal Pelajaran Minggu Ini</h3>
        <span className="text-xs text-slate-400">({schedules.length} jadwal)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {byDay.map(({ day, isToday, items }) => (
          <div
            key={day}
            className={`rounded-xl border bg-white p-4 ${isToday ? 'border-sky-400 ring-1 ring-sky-200' : 'border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-semibold ${isToday ? 'text-sky-700' : 'text-slate-700'}`}>{day}</span>
              {isToday && (
                <span className="text-[10px] font-bold uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Hari Ini</span>
              )}
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">Tidak ada pelajaran</p>
            ) : (
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.id} className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                      <BookOpen size={15} className="text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{s.subject}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-0.5">
                          <Clock size={11} />
                          {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
                        </span>
                        <span className="truncate">{s.teacher_name}</span>
                        {s.room && (
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin size={11} />
                            {s.room}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RENDER CONTENT - menentukan apa yang ditampilkan per menu
// ============================================================
function renderContent(
  roleKey: RoleKey,
  activeMenu: string,
  ctx: {
    accent: string;
    profile: SessionData['profile'];
    stats: { label: string; value: string; note: string; tone: 'orange' | 'green' | 'gold' | 'yellow'; icon: typeof Users }[];
    activities: { text: string; time: string; tone: 'orange' | 'green' | 'gold' | 'yellow' }[];
    adminData: ReturnType<typeof useAdminDashboardData>;
    guruData: ReturnType<typeof useGuruDashboardData>;
    siswaData: ReturnType<typeof useSiswaDashboardData>;
    ortuData: ReturnType<typeof useOrtuDashboardData>;
    tamuData: ReturnType<typeof useTamuDashboardData>;
    setActiveMenu: (m: string) => void;
    setEditTeacher: (t: Teacher | null) => void;
    setEditStudent: (s: Student | null) => void;
    setEditSchedule: (s: (Schedule & { teacher_name: string; class_name: string }) | null) => void;
    editTeacher: Teacher | null;
    editStudent: Student | null;
    editSchedule: (Schedule & { teacher_name: string; class_name: string }) | null;
  },
) {
  const { accent, profile, stats, activities } = ctx;
  const siswaJadwal = ctx.siswaData.jadwalMingguan || [];

  // Dashboard utama
  if (activeMenu === 'Dashboard') {
    const roleError = roleKey === 'admin' ? ctx.adminData.error
      : roleKey === 'guru' ? ctx.guruData.error
      : roleKey === 'siswa' ? ctx.siswaData.error
      : roleKey === 'ortu' ? ctx.ortuData.error
      : ctx.tamuData.error;
    const isLoading = ctx.adminData.loading || ctx.guruData.loading || ctx.siswaData.loading || ctx.ortuData.loading || ctx.tamuData.loading;
    return (
      <>
        <div className="dashboard-welcome" style={{ background: `linear-gradient(105deg, ${shade(accent, 10)} 0%, ${accent} 44%, ${shade(accent, -15)} 100%)` }}>
          <div><h2>Selamat datang, {profile.name}</h2><p>Portal MIRAI · Semester Ganjil 2025/2026</p></div>
          <ShieldCheck size={42} />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} /></div>
        ) : roleError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-sm font-semibold text-rose-700 mb-1">Gagal memuat data dashboard</p>
            <p className="text-xs text-rose-600 mb-3">{roleError}</p>
            <button type="button" onClick={() => {
              if (roleKey === 'admin') ctx.adminData.reload();
              else if (roleKey === 'guru') ctx.guruData.reload();
              else if (roleKey === 'siswa') ctx.siswaData.reload();
              else if (roleKey === 'ortu') ctx.ortuData.reload();
              else ctx.tamuData.reload();
            }} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              {stats.map((s) => <article key={s.label} className={`stat-card stat-${s.tone}`}><div className="stat-icon"><s.icon size={23} /></div><span>{s.label}</span><strong>{s.value}</strong><small><b>{s.note.split(' ')[0]}</b> {s.note.split(' ').slice(1).join(' ')}</small></article>)}
            </div>
            {roleKey === 'siswa' && siswaJadwal.length > 0 && (
              <SiswaJadwalMingguan schedules={siswaJadwal} />
            )}
            <div className="dashboard-columns">
              <article className="activity-card">
                <div className="card-heading"><div><span>AKTIVITAS TERBARU</span><h3>Aktivitas Sistem</h3></div><button type="button">Lihat semua</button></div>
                <div className="activity-list">
                  {activities.length > 0 ? activities.map((a) => <div key={a.text + a.time}><i className={`activity-dot ${a.tone}`} /><p><strong>{a.text}</strong><span>{a.time}</span></p></div>) : <p className="text-sm text-slate-400 py-4">Belum ada aktivitas terbaru.</p>}
                </div>
              </article>
              <article className="quick-card">
                <div className="card-heading"><div><span>AKSES CEPAT</span><h3>Kelola MIRAI</h3></div><BarChart3 size={20} /></div>
                {roleMenus[roleKey].filter((m) => m.label !== 'Dashboard' && m.label !== 'Pengaturan').slice(0, 3).map(({ label, icon: Icon }) => <button type="button" key={label} onClick={() => ctx.setActiveMenu(label)}><Icon size={20} /><span>{label}</span><ChevronDown size={16} /></button>)}
              </article>
            </div>
          </>
        )}
      </>
    );
  }

  // Halaman guru yang sudah terhubung ke database
  if (roleKey === 'guru') {
    if (activeMenu === 'Jadwal Mengajar') return <JadwalMengajarPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Kelas Saya') return <KelasSayaPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Pertemuan Kelas') return <PertemuanKelasPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Persiapan Kelas') return <PersiapanKelasPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Bahan Ajar') return <BahanAjarPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Kumpulan Soal') return <KumpulanSoalPage teacherId={profile.teacherId || ''} />;
    if (activeMenu === 'Kumpulan Angket') return <KumpulanAngketPage teacherId={profile.teacherId || ''} />;
  }

  // Halaman siswa yang sudah terhubung ke database
  if (roleKey === 'siswa') {
    if (activeMenu === 'Ruang Kelas') return <RuangKelasPage studentId={profile.studentId || ''} classId={profile.classId ?? null} onShowMeetings={() => ctx.setActiveMenu('Pertemuan Saya')} />;
    if (activeMenu === 'Pertemuan Saya') return <SiswaMeetingView classId={profile.classId ?? ''} onBack={() => ctx.setActiveMenu('Ruang Kelas')} />;
    if (activeMenu === 'Jadwal Saya') return <JadwalSayaPage classId={profile.classId ?? null} />;
    if (activeMenu === 'Jendela Ilmu') return <JendelaIlmuPage onOpenTutor={() => ctx.setActiveMenu('AI Tutor')} />;
    if (activeMenu === 'AI Tutor') return <AiTutorPage />;
    if (activeMenu === 'Kelompok Belajar') return <KelompokBelajarPage />;
    if (activeMenu === 'Tugas Kelompok') return <TugasKelompokPage />;
  }

  // Halaman admin yang sudah terhubung
  if (roleKey === 'admin') {
    if (activeMenu === 'AI Connector') return <AIConnectorPage />;
    if (activeMenu === 'Profil Admin') return <AdminProfilePage />;
    if (activeMenu === 'Daftar Guru') return <TeacherListPage onAdd={() => { ctx.setEditTeacher(null); ctx.setActiveMenu('Input Data Guru'); }} onEdit={(t) => { ctx.setEditTeacher(t); ctx.setActiveMenu('Input Data Guru'); }} />;
    if (activeMenu === 'Input Data Guru') return <TeacherInputPage onBack={() => { ctx.setEditTeacher(null); ctx.setActiveMenu('Daftar Guru'); }} editTeacher={ctx.editTeacher} />;
    if (activeMenu === 'Daftar Siswa') return <StudentListPage onAdd={() => { ctx.setEditStudent(null); ctx.setActiveMenu('Input Data Siswa'); }} onEdit={(s) => { ctx.setEditStudent(s); ctx.setActiveMenu('Input Data Siswa'); }} />;
    if (activeMenu === 'Input Data Siswa') return <StudentInputPage onBack={() => { ctx.setEditStudent(null); ctx.setActiveMenu('Daftar Siswa'); }} editStudent={ctx.editStudent} />;
    if (activeMenu === 'Jadwal Pembelajaran') return <JadwalPembelajaranPage onAdd={() => { ctx.setEditSchedule(null); ctx.setActiveMenu('Input Jadwal'); }} onEdit={(s) => { ctx.setEditSchedule(s); ctx.setActiveMenu('Input Jadwal'); }} />;
    if (activeMenu === 'Input Jadwal') return <InputJadwalPage onBack={() => { ctx.setEditSchedule(null); ctx.setActiveMenu('Jadwal Pembelajaran'); }} editSchedule={ctx.editSchedule} />;
  }

  // Semua menu lain yang belum terhubung menampilkan "segera hadir"
  return <ComingSoonPage menuName={activeMenu} roleBadge={profile.badge} accent={accent} />;
}

// ============================================================
// COMING SOON PAGE - untuk menu yang belum terhubung
// ============================================================
function ComingSoonPage({ menuName, roleBadge, accent }: { menuName: string; roleBadge: string; accent: string }) {
  return (
    <div className="empty-admin-page">
      <ShieldCheck size={42} style={{ color: accent }} />
      <h2>{menuName}</h2>
      <p>Halaman ini akan segera hadir dan terhubung ke database MIRAI untuk {roleBadge.toLowerCase()}.</p>
    </div>
  );
}

// ============================================================
// STATS - data real per role
// ============================================================
function getStatsForRole(
  roleKey: RoleKey,
  data: {
    adminData: ReturnType<typeof useAdminDashboardData>;
    guruData: ReturnType<typeof useGuruDashboardData>;
    siswaData: ReturnType<typeof useSiswaDashboardData>;
    ortuData: ReturnType<typeof useOrtuDashboardData>;
    tamuData: ReturnType<typeof useTamuDashboardData>;
  },
): { label: string; value: string; note: string; tone: 'orange' | 'green' | 'gold' | 'yellow'; icon: typeof Users }[] {
  const { adminData, guruData, siswaData, ortuData, tamuData } = data;

  switch (roleKey) {
    case 'admin':
      return [
        { label: 'Total Guru', value: String(adminData.stats.totalGuru), note: 'Guru aktif terdaftar', tone: 'orange', icon: Users },
        { label: 'Total Siswa', value: String(adminData.stats.totalSiswa), note: 'Siswa aktif terdaftar', tone: 'green', icon: GraduationCap },
        { label: 'Total Kelas', value: String(adminData.stats.totalKelas), note: 'Kelas aktif tahun 2025/2026', tone: 'gold', icon: BookOpen },
        { label: 'Total Jadwal', value: String(adminData.stats.totalJadwal), note: 'Jadwal mengajar aktif', tone: 'yellow', icon: CalendarDays },
      ];
    case 'guru':
      return [
        { label: 'Kelas Aktif', value: String(guruData.stats.kelasAktif), note: 'Kelas yang diampu', tone: 'orange', icon: BookOpen },
        { label: 'Total Siswa', value: String(guruData.stats.totalSiswa), note: 'Siswa di kelas yang diampu', tone: 'green', icon: Users },
        { label: 'Tugas Aktif', value: String(guruData.stats.tugasAktif), note: 'Tugas belum dinilai', tone: 'gold', icon: ClipboardList },
        { label: 'Rata-rata Kehadiran', value: `${guruData.stats.rataRataKehadiran}%`, note: 'Kehadiran siswa kelas diampu', tone: 'yellow', icon: Activity },
      ];
    case 'siswa':
      return [
        { label: 'Mata Pelajaran', value: String(siswaData.stats.mataPelajaran), note: 'Mapel di kelas saya', tone: 'orange', icon: BookOpen },
        { label: 'Tugas Aktif', value: String(siswaData.stats.tugasAktif), note: 'Tugas yang harus dikerjakan', tone: 'green', icon: ClipboardList },
        { label: 'Rata-rata Nilai', value: String(siswaData.stats.rataRataNilai), note: 'Nilai semua mapel', tone: 'gold', icon: Award },
        { label: 'Kehadiran', value: `${siswaData.stats.kehadiran}%`, note: 'Kehadiran saya', tone: 'yellow', icon: Activity },
      ];
    case 'ortu':
      return [
        { label: 'Rata-rata Nilai Anak', value: String(ortuData.stats.rataRataNilai), note: 'Nilai semua mapel', tone: 'orange', icon: Award },
        { label: 'Kehadiran Anak', value: `${ortuData.stats.kehadiran}%`, note: 'Kehadiran anak', tone: 'green', icon: CalendarDays },
        { label: 'Tugas Aktif', value: String(ortuData.stats.tugasAktif), note: 'Tugas yang belum dikerjakan', tone: 'gold', icon: ClipboardList },
        { label: 'Tagihan Tertunda', value: '0', note: 'Belum ada tagihan', tone: 'yellow', icon: CreditCard },
      ];
    case 'tamu':
      return [
        { label: 'Total Siswa', value: String(tamuData.stats.totalSiswa), note: 'Tahun ajaran 2025/2026', tone: 'orange', icon: GraduationCap },
        { label: 'Total Guru', value: String(tamuData.stats.totalGuru), note: 'Tenaga pendidik aktif', tone: 'green', icon: Users },
        { label: 'Total Kelas', value: String(tamuData.stats.totalKelas), note: 'Kelas aktif', tone: 'gold', icon: BookOpen },
        { label: 'Pengumuman', value: String(tamuData.stats.totalPengumuman), note: 'Pengumuman terbit', tone: 'yellow', icon: Newspaper },
      ];
  }
}

// ============================================================
// ACTIVITIES - data real aktivitas terbaru
// ============================================================
function getActivitiesForRole(
  _roleKey: RoleKey,
  data: { adminData: ReturnType<typeof useAdminDashboardData> },
): { text: string; time: string; tone: 'orange' | 'green' | 'gold' | 'yellow' }[] {
  return data.adminData.activities;
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ onLogin }: { onLogin: (role: LoginRole, session: SessionData) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <main className="mirai-page">
      <div className="background-art" aria-hidden="true">
        <div className="grid-lines" />
        <span className="orb orb-a" /><span className="orb orb-b" /><span className="orb orb-c" />
        <span className="ring ring-a" /><span className="ring ring-b" />
        <span className="dot dot-a" /><span className="dot dot-b" /><span className="dot dot-c" />
      </div>
      <div className="content-grid">
        <section className="welcome-panel">
          <img className="school-logo" src={`${imageBase}/03d27ec3-8a8f-4d.png`} alt="Logo sekolah" />
          <div className="brand-lockup"><span>SELAMAT<br />DATANG DI</span><strong>MIRAI</strong></div>
          <p className="tagline">Ekosistem pembelajaran digital cerdas</p>
          <p className="section-label">Tim riset</p>
          <div className="team-grid">
            {team.map((person) => (
              <div className="team-member" key={person.name}>
                <img src={person.image} alt={person.name} />
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="role-panel">
          <p className="section-label">Pilih peran anda</p>
          <div className="roles-grid">
            {roles.map((role) => (
              <button
                type="button"
                className="role-card"
                key={role.key}
                onClick={() => {
                  if (role.key === 'tamu') {
                    onLogin(role, {
                      key: 'tamu',
                      accent: role.accent,
                      profile: { id: 'tamu', name: 'Pengunjung', sub: 'Akses publik terbatas', badge: 'TAMU' },
                    });
                  } else {
                    setSelectedRole(role);
                  }
                }}
              >
                <span className="role-avatar" style={{ borderColor: role.accent, boxShadow: `0 14px 28px ${role.accent}33` }}>
                  <img src={role.image} alt="" />
                </span>
                <strong>{role.title}</strong>
                <span>{role.description}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      <button type="button" className="admin-button" onClick={() => onLogin(adminRole, {
        key: 'admin',
        accent: adminRole.accent,
        profile: { id: 'admin', name: 'Ahmad Rizki', sub: 'Pengelola Sistem MIRAI', badge: 'ADMINISTRATOR' },
      })} aria-label="Login Admin" title="Login Admin">
        <LockKeyhole size={19} />
      </button>
      {selectedRole && (
        <LoginModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSuccess={(session) => { onLogin(selectedRole, session); setSelectedRole(null); }}
        />
      )}
    </main>
  );
}

// ============================================================
// APP - root component
// ============================================================
function App() {
  const [session, setSession] = useState<SessionData | null>(null);

  if (session) {
    if (session.key === 'tamu') {
      return <TamuDashboard session={session.profile} onLogout={() => setSession(null)} />;
    }
    return <Dashboard roleKey={session.key} accent={session.accent} profile={session.profile} onLogout={() => setSession(null)} />;
  }

  return <HomePage onLogin={(_role, sess) => setSession(sess)} />;
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default App;
