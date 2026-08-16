import { ChevronRight } from "lucide-react";
import { navItems } from "./navConfig";

const logoUrl = "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/03d27ec3-8a8f-4d.png";

interface SidebarProps {
  activeItem: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activeItem, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className="guru-sidebar flex h-full flex-col overflow-hidden transition-[width,min-width] duration-300"
      style={{ width: collapsed ? 76 : 280, minWidth: collapsed ? 76 : 280 }}
    >
      <div className={`guru-sidebar-header flex shrink-0 items-center border-b border-white/10 ${collapsed ? "justify-center px-3" : "gap-3 px-5"}`}>
        <div className="guru-logo-shell shrink-0">
          <img src={logoUrl} alt="Logo UPI" className="h-full w-full object-contain" crossOrigin="anonymous" />
        </div>
        {!collapsed && <div className="min-w-0"><p className="truncate text-lg font-black tracking-[0.18em] text-white">MIRAI</p><p className="text-[10px] font-medium tracking-wide text-white/50">DASHBOARD GURU</p></div>}
      </div>

      <nav className="guru-sidebar-nav scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {navItems.filter((item) => item.id !== "profil-guru").map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;
          return <div key={item.id}>
            {item.section && !collapsed && <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--guru-yellow))]">{item.section}</p>}
            {item.section && collapsed && <div className="mx-2 my-3 border-t border-white/10" />}
            <button type="button" onClick={() => onNavigate(item.id)} title={collapsed ? item.label : undefined} className={`guru-nav-item group relative ${collapsed ? "justify-center px-0" : "px-3"} ${active ? "guru-nav-item-active" : ""}`}>
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              {collapsed && <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">{item.label}</span>}
            </button>
          </div>;
        })}
      </nav>

      <div className={`border-t border-white/10 px-3 py-3 ${collapsed ? "text-center" : ""}`}>
        {!collapsed && <p className="px-2 text-[10px] leading-relaxed text-white/40">Ruang kerja pembelajaran<br />SMP Kelas 7</p>}
        {collapsed && <ChevronRight className="mx-auto h-4 w-4 text-white/35" aria-hidden="true" />}
      </div>
    </aside>
  );
}
