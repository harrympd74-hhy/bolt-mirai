import { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { navItems } from "./navConfig";
export default function MobileDrawer({ open, onClose, activeItem, onNavigate }: { open: boolean; onClose: () => void; activeItem: string; onNavigate: (id: string) => void }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const parent = navItems.find((item) => item.children?.some((child) => child.id === activeItem));
    return parent ? { [parent.id]: true } : {};
  });
  const toggle = (id: string) => setOpenMenus((previous) => ({ ...previous, [id]: !previous[id] }));
  const isParentActive = (id: string, children?: { id: string }[]) => activeItem === id || (children?.some((child) => child.id === activeItem) ?? false);
  return (
    <>
      <button type="button" aria-label="Tutup menu" onClick={onClose} className={`fixed inset-0 z-50 bg-slate-950/50 transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[hsl(var(--mirai-sidebar))] transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="text-lg font-black tracking-widest text-white">MIRAI</span>
          <button type="button" onClick={onClose} aria-label="Tutup"><X size={18} className="text-white" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const openMenu = openMenus[item.id];
            const active = isParentActive(item.id, item.children);
            return (
              <div key={item.id}>
                <button type="button" onClick={() => (item.children ? toggle(item.id) : onNavigate(item.id))} className={`flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left text-sm ${active ? "border-[hsl(var(--guru-gold))] bg-white/15 text-white" : "border-transparent text-white/75 hover:bg-white/10"}`}>
                  <Icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.children && (openMenu ? <ChevronDown size={15} className="text-white/50" /> : <ChevronRight size={15} className="text-white/50" />)}
                </button>
                {item.children && openMenu && (
                  <div className="ml-5 space-y-0.5 border-l border-white/15 pl-2 pb-1">
                    {item.children.map((child) => (
                      <button key={child.id} type="button" onClick={() => onNavigate(child.id)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${activeItem === child.id ? "font-semibold text-[hsl(45_90%_64%)]" : "text-white/60 hover:text-white"}`}>
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
      </aside>
    </>
  );
}
