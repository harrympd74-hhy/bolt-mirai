import { CalendarDays, CheckCircle2, ChevronRight, Clock, Users, Zap, BookMarked } from "lucide-react";

interface BerandaProps {
  onNavigate: (id: string) => void;
}

const jadwalHariIni = [
  { jam: "07.30", kelas: "VII-A", mapel: "Matematika", ruang: "R-101", status: "selesai" },
  { jam: "09.00", kelas: "VII-B", mapel: "Matematika", ruang: "R-102", status: "aktif" },
  { jam: "11.00", kelas: "VII-C", mapel: "Matematika", ruang: "R-103", status: "akan" },
] as const;

const shortcuts = [
  { id: "kelas-aktif", label: "Kelas 7 Aktif", icon: Zap, tone: "bg-[hsl(var(--guru-turquoise))]" },
  { id: "jadwal-mengajar", label: "Jadwal Kelas 7", icon: CalendarDays, tone: "bg-[hsl(var(--guru-sapphire))]" },
  { id: "bank-soal", label: "Bank Soal Kelas 7", icon: BookMarked, tone: "bg-[hsl(var(--guru-brown))]" },
  { id: "detail-kelas", label: "Detail Kelas 7", icon: Users, tone: "bg-[hsl(var(--guru-yellow))]" },
];

export default function Beranda({ onNavigate }: BerandaProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="admin-hero rounded-2xl p-6 text-primary-foreground shadow-lg">
        <p className="text-sm font-medium text-primary-foreground/75">Selamat datang kembali,</p>
        <h1 className="mt-1 text-2xl font-black">Dashboard Guru Kelas 7</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">SMP · Tahun Pelajaran 2025/2026</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Akses Cepat Kelas 7</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map(({ id, label, icon: Icon, tone }) => (
            <button key={id} type="button" onClick={() => onNavigate(id)} className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone} text-primary-foreground transition group-hover:scale-105`}><Icon size={20} /></span>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[hsl(var(--guru-turquoise))]" /><h2 className="font-semibold text-foreground">Jadwal Hari Ini · Kelas 7</h2></div>
          <button type="button" onClick={() => onNavigate("jadwal-mengajar")} className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground">Lihat semua <ChevronRight size={12} /></button>
        </div>
        <div className="divide-y divide-border">
          {jadwalHariIni.map((jadwal) => (
            <div key={`${jadwal.jam}-${jadwal.kelas}`} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="flex items-center gap-4"><span className="w-12 font-mono text-sm text-muted-foreground">{jadwal.jam}</span><div><p className="text-sm font-semibold text-foreground">{jadwal.kelas} — {jadwal.mapel}</p><p className="text-xs text-muted-foreground">{jadwal.ruang}</p></div></div>
              <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${jadwal.status === "aktif" ? "bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]" : jadwal.status === "selesai" ? "bg-muted text-muted-foreground" : "bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]"}`}>{jadwal.status === "aktif" && <Zap size={11} />}{jadwal.status === "selesai" && <CheckCircle2 size={11} />}{jadwal.status === "akan" && <Clock size={11} />}{jadwal.status === "aktif" ? "Aktif" : jadwal.status === "selesai" ? "Selesai" : "Akan datang"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
