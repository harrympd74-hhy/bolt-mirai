import { useState } from "react";
import { Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock3, Megaphone, Search, Star, TrendingUp, Users, WalletCards, Zap } from "lucide-react";
import { defaultProfileData } from "@/data/guruData";
import TemanAI from "./TemanAI";
import ScheduleList from "@/components/shared/ScheduleList";

interface BerandaProps { onNavigate: (id: string) => void; }

const schedule = [
  { time: "07.30 – 08.45", className: "VII-A", subject: "Matematika", room: "R-101", status: "Selesai", tone: "done" },
  { time: "09.00 – 10.15", className: "VII-B", subject: "Matematika", room: "R-102", status: "Berlangsung", tone: "live" },
  { time: "10.45 – 12.00", className: "VII-C", subject: "Matematika", room: "R-103", status: "Akan datang", tone: "next" },
  { time: "12.30 – 13.15", className: "VII-A", subject: "Matematika", room: "R-101", status: "Akan datang", tone: "next" },
] as const;

const classes = [
  { name: "VII-A", students: 32, progress: 82, tone: "turquoise" },
  { name: "VII-B", students: 30, progress: 78, tone: "sapphire" },
  { name: "VII-C", students: 31, progress: 80, tone: "yellow" },
] as const;

const quickActions = [
  { id: "rencana-pembelajaran", label: "Buat Tugas", caption: "Buat tugas baru", icon: ClipboardList, tone: "turquoise" },
  { id: "partisipasi-kehadiran", label: "Input Nilai", caption: "Kelola penilaian", icon: TrendingUp, tone: "sapphire" },
  { id: "rencana-pembelajaran", label: "Unduh RPP", caption: "Siapkan pembelajaran", icon: BookOpen, tone: "yellow" },
  { id: "materi-konten", label: "Jelajahi Materi", caption: "Dari pustaka kelas", icon: WalletCards, tone: "brown" },
] as const;

const toneClasses: Record<string, string> = {
  turquoise: "bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]",
  sapphire: "bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]",
  yellow: "bg-[hsl(var(--guru-yellow-soft))] text-[hsl(var(--guru-brown))]",
  brown: "bg-[hsl(27_48%_31%/0.12)] text-[hsl(var(--guru-brown))]",
};

function ProgressBar({ value, tone = "turquoise" }: { value: number; tone?: string }) {
  return <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${tone === "yellow" ? "bg-[hsl(var(--guru-yellow))]" : tone === "sapphire" ? "bg-[hsl(var(--guru-sapphire))]" : "bg-[hsl(var(--guru-turquoise))]"}`} style={{ width: `${value}%` }} /></div>;
}

export default function Beranda({ onNavigate }: BerandaProps) {
  const [search, setSearch] = useState("");
  const day = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return <div className="mx-auto max-w-[1280px] space-y-5 pb-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative min-w-0 flex-1 sm:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari siswa, kelas, atau materi..." className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[hsl(var(--guru-turquoise))] focus:ring-2 focus:ring-[hsl(var(--guru-turquoise)/0.18)]" /></div>
      <div className="flex items-center gap-3"><button type="button" aria-label="Notifikasi" className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-foreground"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--guru-yellow))]" /></button><div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--guru-turquoise))] text-xs font-bold text-primary-foreground">GD</div><div className="hidden text-left sm:block"><p className="text-xs font-bold text-foreground">{defaultProfileData.namaLengkap}</p><p className="text-[10px] text-muted-foreground">Guru {defaultProfileData.mataPelajaran}</p></div></div></div>
    </div>

    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(var(--guru-sapphire))] via-[hsl(var(--guru-turquoise))] to-[hsl(var(--guru-turquoise-soft))] p-5 text-primary-foreground shadow-lg sm:p-7"><div className="relative z-10 max-w-lg"><p className="text-sm font-medium text-primary-foreground/75">{day}</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Selamat datang,<br />{defaultProfileData.namaLengkap}.</h1><p className="mt-2 max-w-md text-sm text-primary-foreground/75">Terus dampingi perjalanan belajar siswa SMP kelas 7 dengan pembelajaran Matematika yang bermakna.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">Mengajar Kelas 7</span><span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">Matematika</span><span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">{defaultProfileData.unitKerja}</span></div></div><div className="absolute -right-8 -top-16 h-52 w-52 rounded-full border-[28px] border-primary-foreground/10" /><div className="absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[22px] border-[hsl(var(--guru-yellow)/0.45)]" /></section>
    <ScheduleList title="Jadwal Mengajar" audience="teacher" />

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Jumlah Siswa","93","+3% dari bulan lalu",Users,"turquoise"],["Kelas Diampu","3","VII-A, VII-B, VII-C",BookOpen,"sapphire"],["Tugas Aktif","8","3 perlu dinilai",ClipboardList,"yellow"],["Rata-rata Nilai","78,4","+5% dari bulan lalu",Star,"brown"]].map(([label,value,change,Icon,tone])=><div key={String(label)} className={`rounded-2xl border border-border p-4 ${toneClasses[String(tone)]}`}><div className="flex items-center justify-between"><p className="text-xs font-semibold opacity-80">{label}</p><span className="rounded-lg bg-card/60 p-2"><Icon className="h-4 w-4" /></span></div><p className="mt-2 text-2xl font-black text-foreground">{value}</p><p className="mt-1 text-[10px] font-medium opacity-75">{change}</p></div>)}</section>

    <section><TemanAI /></section>

    <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr_0.78fr]">
      <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[hsl(var(--guru-turquoise))]" /><h2 className="text-sm font-bold">Jadwal Hari Ini</h2></div><button type="button" onClick={() => onNavigate("jadwal-kelas")} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">Lihat semua <ChevronRight className="h-3 w-3" /></button></div><div className="divide-y divide-border">{schedule.map((item) => <div key={`${item.time}-${item.className}`} className="flex items-center justify-between gap-2 px-5 py-3"><div className="flex min-w-0 items-center gap-3"><span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground">{item.time}</span><div className="min-w-0"><p className="truncate text-xs font-bold">{item.className} · {item.subject}</p><p className="text-[10px] text-muted-foreground">{item.room}</p></div></div><span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${item.tone === "live" ? "bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]" : item.tone === "done" ? "bg-muted text-muted-foreground" : "bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]"}`}>{item.tone === "live" ? <Zap className="h-3 w-3" /> : item.tone === "done" ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}{item.status}</span></div>)}</div></section>

      <section className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[hsl(var(--guru-sapphire))]" /><h2 className="text-sm font-bold">Progres Pembelajaran</h2></div><span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">Semester Ganjil</span></div><div className="space-y-4">{[["VII-A",82,"turquoise"],["VII-B",78,"sapphire"],["VII-C",80,"yellow"]].map(([name,value,tone])=><div key={String(name)}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold">{name} · Matematika</span><span className="text-muted-foreground">{value}%</span></div><ProgressBar value={Number(value)} tone={String(tone)} /></div>)}</div><div className="mt-5 rounded-xl bg-[hsl(var(--guru-yellow-soft))] p-3"><p className="text-xs font-bold text-[hsl(var(--guru-brown))]">Teruslah berkarya!</p><p className="mt-1 text-[10px] leading-relaxed text-[hsl(var(--guru-brown)/0.75)]">Pembelajaran yang konsisten membantu siswa kelas 7 berkembang.</p></div></section>

      <section className="rounded-2xl border border-border bg-card p-5"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[hsl(var(--guru-brown))]" /><h2 className="text-sm font-bold">Kalender</h2></div><span className="text-[10px] text-muted-foreground">Juni 2026</span></div><div className="grid grid-cols-7 gap-y-2 text-center text-[10px] text-muted-foreground">{["S","S","R","K","J","S","M",...Array.from({length:35},(_,i)=>String((i%30)+1))].map((dayItem,index)=><span key={`${dayItem}-${index}`} className={dayItem === "15" ? "mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--guru-yellow))] font-bold text-[hsl(var(--guru-brown))]" : "py-1"}>{dayItem}</span>)}</div></section>
    </div>

    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]"><section className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-[hsl(var(--guru-turquoise))]" /><h2 className="text-sm font-bold">Kelas Saya · Kelas 7</h2></div><button type="button" onClick={() => onNavigate("daftar-kelas")} className="text-[10px] text-muted-foreground hover:text-foreground">Lihat detail <ChevronRight className="inline h-3 w-3" /></button></div><div className="grid gap-3 sm:grid-cols-3">{classes.map((item)=><button type="button" key={item.name} onClick={() => onNavigate("daftar-kelas")} className="rounded-xl border border-border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className={`rounded-lg px-2 py-1 text-xs font-bold ${toneClasses[item.tone]}`}>{item.name}</span><span className="text-[10px] text-muted-foreground">{item.students} siswa</span></div><div className="mt-4"><ProgressBar value={item.progress} tone={item.tone} /><p className="mt-1 text-right text-[10px] text-muted-foreground">{item.progress}% capaian</p></div></button>)}</div></section><section className="rounded-2xl border border-border bg-card p-5"><div className="mb-3 flex items-center gap-2"><Megaphone className="h-4 w-4 text-[hsl(var(--guru-yellow))]" /><h2 className="text-sm font-bold">Pengumuman</h2></div><div className="space-y-3 text-xs"><div className="border-b border-border pb-3"><p className="font-semibold">Rapat evaluasi pembelajaran</p><p className="mt-1 text-[10px] text-muted-foreground">Senin, 15 Juni 2026 · 10.00 WIB</p></div><div className="border-b border-border pb-3"><p className="font-semibold">Pengumpulan nilai kelas 7</p><p className="mt-1 text-[10px] text-muted-foreground">Selasa, 16 Juni 2026 · 23.59 WIB</p></div><div><p className="font-semibold">Workshop kurikulum sekolah</p><p className="mt-1 text-[10px] text-muted-foreground">Sabtu, 20 Juni 2026 · 08.00 WIB</p></div></div></section></div>

    <section><h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Akses Cepat</h2><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{quickActions.map(({id,label,caption,icon:Icon,tone})=><button key={id} type="button" onClick={() => onNavigate(id)} className={`flex items-center gap-3 rounded-2xl border border-border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}><span className="rounded-xl bg-card/70 p-2"><Icon className="h-5 w-5" /></span><span><span className="block text-xs font-bold text-foreground">{label}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{caption}</span></span></button>)}</div></section>
  </div>;
}
