import { useEffect, useState } from "react";
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, Menu, MessageSquareText, PanelLeftClose, PanelLeftOpen, Settings, TrendingUp, UserRound, X } from "lucide-react";
import Beranda from "./orangtua/Beranda";
import PlaceholderPage from "./orangtua/PlaceholderPage";

const logoUrl = "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/03d27ec3-8a8f-4d.png";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profil-anak", label: "Profil Anak", icon: UserRound },
  { id: "perkembangan", label: "Perkembangan Siswa", icon: TrendingUp },
  { id: "angket-kinerja", label: "Angket Kinerja", icon: ClipboardList },
  { id: "infografis", label: "Infografis", icon: BarChart3 },
  { id: "catatan-guru", label: "Catatan Guru", icon: MessageSquareText },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
] as const;

export default function OrangtuaDashboard() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (event: MediaQueryListEvent) => { if (event.matches) setDrawer(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const navigate = (id: string) => { setActive(id); setDrawer(false); window.scrollTo(0, 0); };
  const activeItem = menu.find((item) => item.id === active) ?? menu[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[hsl(var(--ortu-cream-soft)/0.35)]">
      <div className="flex min-h-0 flex-1">
        <aside className={`ortu-sidebar hidden h-full flex-col overflow-hidden transition-[width,min-width] duration-300 lg:flex ${collapsed ? "w-[76px] min-w-[76px]" : "w-[264px] min-w-[264px]"}`}>
          <div className={`flex shrink-0 items-center border-b border-white/10 ${collapsed ? "justify-center px-3" : "gap-3 px-5"}`} style={{ minHeight: 72 }}>
            <img src={logoUrl} alt="Logo MIRAI" className="h-10 w-10 shrink-0 rounded-xl border border-white/25 bg-card p-1 object-contain" crossOrigin="anonymous" />
            {!collapsed && <div className="min-w-0"><p className="truncate text-lg font-black tracking-[0.18em] text-white">MIRAI</p><p className="text-[10px] font-medium tracking-wide text-white/50">DASHBOARD ORANG TUA</p></div>}
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {menu.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => navigate(id)} title={collapsed ? label : undefined} className={`ortu-nav-item group relative ${collapsed ? "justify-center px-0" : "px-3"} ${active === id ? "ortu-nav-item-active" : ""}`}>
                <Icon size={17} className="ortu-nav-icon shrink-0" />
                {!collapsed && <span className="truncate font-medium">{label}</span>}
                {collapsed && <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-[hsl(var(--ortu-brown-deep))] px-3 py-2 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">{label}</span>}
              </button>
            ))}
          </nav>

          <div className={`border-t border-white/10 px-3 py-3 ${collapsed ? "text-center" : ""}`}>
            {!collapsed && <p className="px-2 text-[10px] leading-relaxed text-white/45">Portal pemantauan orang tua<br />SMP Kelas 7 · MIRAI</p>}
            {collapsed && <PanelLeftClose className="mx-auto h-4 w-4 text-white/35" aria-hidden="true" />}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setDrawer(true)} aria-label="Buka menu" className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"><Menu size={20} /></button>
              <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar" className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:flex">{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">MIRAI</span>
                <span className="hidden text-muted-foreground sm:inline">/</span>
                <span className="flex items-center gap-1.5 font-semibold"><ActiveIcon size={15} className="text-[hsl(var(--ortu-brown))]" />{activeItem.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl px-2 py-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--ortu-gold))] text-xs font-bold text-[hsl(var(--ortu-brown))]">IR</span>
                <span className="hidden text-sm font-medium sm:inline">Ibu Ratna</span>
              </div>
              <button type="button" onClick={() => window.location.assign("/")} aria-label="Keluar" title="Keluar" className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground"><LogOut size={16} /></button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
            {active === "dashboard" ? <Beranda onNavigate={navigate} /> : <PlaceholderPage title={activeItem.label} icon={activeItem.icon} />}
          </main>
        </div>
      </div>

      {drawer && (
        <>
          <button type="button" aria-label="Tutup menu" onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />
          <aside className="ortu-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col lg:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-2">
                <img src={logoUrl} alt="Logo MIRAI" className="h-9 w-9 rounded-xl border border-white/25 bg-card p-1 object-contain" crossOrigin="anonymous" />
                <span className="text-lg font-black tracking-widest text-white">MIRAI</span>
              </div>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Tutup"><X size={18} className="text-white" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {menu.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => navigate(id)} className={`ortu-nav-item px-3 ${active === id ? "ortu-nav-item-active" : ""}`}><Icon size={17} className="ortu-nav-icon shrink-0" /><span className="truncate font-medium">{label}</span></button>
              ))}
            </nav>
            <button type="button" onClick={() => window.location.assign("/")} className="m-3 flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-white/75 hover:bg-white/10"><LogOut size={16} /> Keluar</button>
          </aside>
        </>
      )}
    </div>
  );
}
