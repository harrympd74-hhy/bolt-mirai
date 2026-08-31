import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, Newspaper, Images, Users,
  LogOut, Menu, X, Loader2, GraduationCap, BookOpen,
  ShieldCheck, ChevronRight, Sparkles,
  Building2, Mail, Phone, MapPin, Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Earthy palette: #335c67 #a3b18a #588157 #fff3b0 #e09f3e
const PALETTE = {
  primary: '#335c67',
  secondary: '#588157',
  sage: '#a3b18a',
  cream: '#fff3b0',
  warm: '#e09f3e',
};

const TAMU_MENUS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Informasi Sekolah', icon: FileText },
  { label: 'Berita & Pengumuman', icon: Newspaper },
  { label: 'Galeri', icon: Images },
  { label: 'Kontak', icon: Users },
];

interface TamuSession {
  name: string;
  sub: string;
  badge: string;
}

// ============================================================
// MAIN TAMU DASHBOARD
// ============================================================
export function TamuDashboard({ session, onLogout }: { session: TamuSession; onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f1' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: `linear-gradient(180deg, ${PALETTE.primary} 0%, #264a52 50%, #1e3d44 100%)` }}
      >
        {/* Brand */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: PALETTE.cream }}
          >
            <Sparkles className="w-5 h-5" style={{ color: PALETTE.primary }} />
          </div>
          <div>
            <strong className="text-white text-base font-bold tracking-wide block leading-tight">MIRAI</strong>
            <span className="text-white/60 text-xs">Portal Tamu</span>
          </div>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 border-b border-white/10">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
            style={{ background: PALETTE.cream, color: PALETTE.primary }}
          >
            {session.badge}
          </span>
          <strong className="text-white text-sm font-semibold block">{session.name}</strong>
          <small className="text-white/50 text-xs">{session.sub}</small>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {TAMU_MENUS.map((item) => {
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveMenu(item.label); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { background: PALETTE.secondary } : undefined}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200/60"
          style={{ background: 'rgba(250, 248, 241, 0.95)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Buka menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{session.badge}</span>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">{activeMenu}</h1>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: PALETTE.cream, color: PALETTE.primary }}
          >
            <Sparkles size={15} />
            <span>Akses Publik</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeMenu === 'Dashboard' ? (
            <TamuDashboardHome />
          ) : (
            <TamuComingSoon menuName={activeMenu} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAMU DASHBOARD HOME - real data from database
// ============================================================
function TamuDashboardHome() {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKelas: 0,
    totalPengumuman: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [sRes, tRes, cRes, aRes] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('classes').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
    ]);
    setStats({
      totalSiswa: sRes.count || 0,
      totalGuru: tRes.count || 0,
      totalKelas: cRes.count || 0,
      totalPengumuman: aRes.count || 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const statCards = [
    { label: 'Total Siswa', value: stats.totalSiswa, note: 'Tahun ajaran 2025/2026', icon: GraduationCap, color: PALETTE.primary, bg: '#e8f0f2' },
    { label: 'Total Guru', value: stats.totalGuru, note: 'Tenaga pendidik aktif', icon: Users, color: PALETTE.secondary, bg: '#e8f0e8' },
    { label: 'Total Kelas', value: stats.totalKelas, note: 'Kelas aktif', icon: BookOpen, color: PALETTE.warm, bg: '#fdf0e0' },
    { label: 'Pengumuman', value: stats.totalPengumuman, note: 'Pengumuman terbit', icon: Newspaper, color: '#b8860b', bg: '#fff8d6' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: PALETTE.primary }} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(120deg, ${PALETTE.primary} 0%, #264a52 60%, ${PALETTE.secondary} 100%)` }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-white/80" />
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Selamat Datang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Portal Publik MIRAI</h2>
          <p className="text-white/70 text-sm max-w-lg">
            Akses informasi sekolah, berita, pengumuman, dan galeri kegiatan. Semester Ganjil 2025/2026.
          </p>
        </div>
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 -translate-y-12 translate-x-12"
          style={{ background: PALETTE.cream }}
        />
        <div
          className="absolute bottom-0 right-20 w-24 h-24 rounded-full opacity-10 translate-y-8"
          style={{ background: PALETTE.warm }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 hover:shadow-md transition-shadow"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ background: s.bg }}
            >
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-none mb-1">{s.value}</p>
            <p className="text-sm font-medium text-slate-600 mb-0.5">{s.label}</p>
            <p className="text-xs text-slate-400">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* About school */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: '#e8f0f2' }}
            >
              <Building2 className="w-4.5 h-4.5" style={{ color: PALETTE.primary }} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Tentang</span>
              <h3 className="text-base font-bold text-slate-800">Sekolah MIRAI</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            MIRAI adalah ekosistem pembelajaran digital cerdas yang mengintegrasikan teknologi AI
            untuk mendukung proses pendidikan yang adaptif dan personal.
          </p>
          <div className="space-y-2.5">
            <InfoRow icon={MapPin} text="Jl. Dr. Setiabudi No.229, Bandung" color={PALETTE.secondary} />
            <InfoRow icon={Phone} text="(022) 1234-5678" color={PALETTE.warm} />
            <InfoRow icon={Mail} text="info@mirai-school.sch.id" color={PALETTE.primary} />
            <InfoRow icon={Clock} text="Senin - Sabtu, 07.00 - 15.00" color={PALETTE.sage} />
          </div>
        </div>

        {/* Quick access */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: '#fdf0e0' }}
            >
              <Sparkles className="w-4.5 h-4.5" style={{ color: PALETTE.warm }} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Jelajahi</span>
              <h3 className="text-base font-bold text-slate-800">Menu Publik</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Menu berikut akan segera terhubung dan menampilkan informasi lengkap dari database sekolah.
          </p>
          <div className="space-y-2">
            {TAMU_MENUS.filter((m) => m.label !== 'Dashboard').map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200/60 bg-slate-50/50"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: PALETTE.cream }}
                >
                  <m.icon className="w-4 h-4" style={{ color: PALETTE.primary }} />
                </div>
                <span className="text-sm font-medium text-slate-600 flex-1">{m.label}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: PALETTE.sage + '40', color: PALETTE.secondary }}
                >
                  Segera
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INFO ROW
// ============================================================
function InfoRow({ icon: Icon, text, color }: { icon: typeof MapPin; text: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-500">
      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
      <span>{text}</span>
    </div>
  );
}

// ============================================================
// COMING SOON PAGE - earthy themed
// ============================================================
function TamuComingSoon({ menuName }: { menuName: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-2xl border border-slate-200/80 bg-white p-10 sm:p-14 text-center relative overflow-hidden"
      >
        {/* Decorative top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${PALETTE.primary} 0%, ${PALETTE.secondary} 50%, ${PALETTE.warm} 100%)` }}
        />

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: PALETTE.cream }}
        >
          <ShieldCheck className="w-8 h-8" style={{ color: PALETTE.primary }} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">{menuName}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
          Halaman ini akan segera hadir dan terhubung ke database MIRAI.
          Informasi lengkap akan tersedia untuk publik setelah koneksi selesai.
        </p>

        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: PALETTE.sage + '30', color: PALETTE.secondary }}
        >
          <Clock size={15} />
          <span>Dalam Pengembangan</span>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <span className="w-2 h-2 rounded-full" style={{ background: PALETTE.primary }} />
          <span className="w-2 h-2 rounded-full" style={{ background: PALETTE.secondary }} />
          <span className="w-2 h-2 rounded-full" style={{ background: PALETTE.sage }} />
          <span className="w-2 h-2 rounded-full" style={{ background: PALETTE.cream }} />
          <span className="w-2 h-2 rounded-full" style={{ background: PALETTE.warm }} />
        </div>
      </div>
    </div>
  );
}
