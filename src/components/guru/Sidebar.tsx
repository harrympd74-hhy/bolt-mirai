import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "./navConfig";

const logoUrl = "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/03d27ec3-8a8f-4d.png";

interface SidebarProps {
  activeItem: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activeItem, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const parent = navItems.find((item) => item.children?.some((child) => child.id === activeItem));
    return parent ? { [parent.id]: true } : {};
  });

  const toggle = (id: string) => {
    if (collapsed) {
      onToggleCollapse();
      setOpenMenus((previous) => ({ ...previous, [id]: true }));
      return;
    }
    setOpenMenus((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  const isParentActive = (id: string, children?: { id: string }[]) => activeItem === id || (children?.some((child) => child.id === activeItem) ?? false);

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
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isParentActive(item.id, item.children);
          const open = openMenus[item.id];
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => (item.children ? toggle(item.id) : onNavigate(item.id))}
                title={collapsed ? item.label : undefined}
                className={`guru-nav-item group relative ${collapsed ? "justify-center px-0" : "px-3"} ${active ? "guru-nav-item-active" : ""}`}
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && <span className="flex-1 truncate font-medium">{item.label}</span>}
                {!collapsed && item.children && (open ? <ChevronDown size={14} className="shrink-0 text-white/40" /> : <ChevronRight size={14} className="shrink-0 text-white/40" />)}
                {collapsed && <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">{item.label}</span>}
              </button>
              {item.children && open && !collapsed && (
                <div className="ml-4 space-y-0.5 border-l border-white/10 pl-2">
                  {item.children.map((child) => (
                    <button key={child.id} type="button" onClick={() => onNavigate(child.id)} className={`guru-nav-child flex w-full items-center gap-2 px-3 py-2 text-left text-[11.5px] text-white/60 transition hover:text-white ${activeItem === child.id ? "guru-nav-child-active" : ""}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${activeItem === child.id ? "bg-[hsl(var(--guru-gold))]" : "bg-white/30"}`} />
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 px-3 py-3 ${collapsed ? "text-center" : ""}`}>
        {!collapsed && <p className="px-2 text-[10px] leading-relaxed text-white/40">Ruang kerja pembelajaran<br />SMP Kelas 7</p>}
        {collapsed && <ChevronRight className="mx-auto h-4 w-4 text-white/35" aria-hidden="true" />}
      </div>
    </aside>
  );
}
