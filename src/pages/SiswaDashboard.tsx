import { useState } from "react";
import { BookOpen, Calendar, CheckCircle2, Flame, Home, LogOut, Menu, PlayCircle, Star, Target, User, X, Zap } from "lucide-react";
import { assignments, groups, lessons, siswaProfile } from "@/data/siswaDashboardData";
import AITutorSession from "./siswa/AITutorSession";

const menuItems = [
  { label: "Beranda", Icon: Home },
  { label: "Jadwal Pelajaran", Icon: Calendar },
  { label: "Ruang Kelas", Icon: PlayCircle },
  { label: "Jendela Ilmu", Icon: BookOpen },
  { label: "Meja Kerja", Icon: CheckCircle2 },
  { label: "Papan Nama", Icon: User },
];

function Navigation({ active, open, onClose, onSelect }: { active: string; open: boolean; onClose: () => void; onSelect: (label: string) => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card shadow-xl transition-transform lg:static lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-3 border-b border-border p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--guru-turquoise))] text-lg font-black text-primary-foreground">M</div>
        <div><h1 className="text-2xl font-black">MIRAI</h1><p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--guru-turquoise))]">Portal Siswa</p></div>
        <button type="button" onClick={onClose} className="ml-auto lg:hidden" aria-label="Tutup menu"><X size={18} /></button>
      </div>
      <div className="m-3 rounded-2xl border border-border bg-muted/50 p-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--guru-yellow))] font-bold text-[hsl(var(--guru-brown))]">AR</div><div><p className="text-sm font-bold">{siswaProfile.name}</p><p className="text-xs text-muted-foreground">{siswaProfile.className} · {siswaProfile.nisn}</p></div></div><p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--guru-brown))]"><Flame size={13} /> {siswaProfile.streak} hari streak</p></div>
      <nav className="flex-1 space-y-1 px-3 py-2">{menuItems.map(({ label, Icon }) => <button type="button" key={label} onClick={() => { onSelect(label); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active === label ? "bg-[hsl(var(--guru-turquoise))] text-primary-foreground" : "text-foreground hover:bg-muted"}`}><Icon size={17} /><span className="flex-1 text-left">{label}</span>{label === "Meja Kerja" && <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">{assignments.filter((item) => !item.done).length}</span>}</button>)}</nav>
      <button type="button" onClick={() => window.location.assign("/")} className="m-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive hover:bg-destructive/10"><LogOut size={17} /> Keluar</button>
    </aside>
  );
}

function StudentHome({ onClass }: { onClass: () => void }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl bg-gradient-to-br from-[hsl(var(--guru-sapphire))] via-[hsl(var(--guru-turquoise))] to-[hsl(var(--guru-yellow-soft))] p-6 text-primary-foreground shadow-lg sm:p-8"><p className="text-sm text-primary-foreground/75">SMP Kelas 7 · Matematika</p><h1 className="mt-1 text-3xl font-black">Halo, Ahmad</h1><p className="mt-2 text-sm text-primary-foreground/75">Lanjutkan belajar bangun ruang segitiga dan jenis-jenis garis.</p></section>
      <div className="grid grid-cols-3 gap-3"><div className="rounded-2xl border border-border bg-card p-4"><Flame className="mb-3 text-[hsl(var(--guru-yellow))]" size={20} /><b className="text-xl">{siswaProfile.streak}</b><p className="text-xs text-muted-foreground">Streak Belajar</p></div><div className="rounded-2xl border border-border bg-card p-4"><Zap className="mb-3 text-[hsl(var(--guru-sapphire))]" size={20} /><b className="text-xl">{siswaProfile.dayaJuang}%</b><p className="text-xs text-muted-foreground">Daya Juang</p></div><div className="rounded-2xl border border-border bg-card p-4"><Star className="mb-3 text-[hsl(var(--guru-turquoise))]" size={20} /><b className="text-xl">{siswaProfile.totalPoints}</b><p className="text-xs text-muted-foreground">Total Poin</p></div></div>
      <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-border bg-card"><h2 className="flex items-center gap-2 border-b border-border p-5 text-sm font-bold"><Calendar size={16} /> Jadwal Hari Ini · Kelas 7</h2>{lessons.map((lesson) => <div key={lesson.time} className="flex gap-3 border-b border-border p-4 last:border-0"><div className="h-9 w-1 rounded-full bg-[hsl(var(--guru-turquoise))]" /><div><p className="text-sm font-semibold">{lesson.subject}</p><p className="text-xs text-muted-foreground">{lesson.time} · {lesson.room}</p></div></div>)}</section><section className="rounded-2xl border border-border bg-card"><h2 className="flex items-center gap-2 border-b border-border p-5 text-sm font-bold"><CheckCircle2 size={16} /> Meja Kerja</h2>{assignments.map((task) => <div key={task.title} className="flex gap-3 border-b border-border p-4 last:border-0"><CheckCircle2 size={16} className={task.done ? "text-[hsl(var(--guru-turquoise))]" : "text-muted-foreground"} /><div><p className="text-sm font-medium">{task.title}</p><p className="text-xs text-muted-foreground">{task.subject} · {task.due}</p></div></div>)}</section></div>
      <section><h2 className="mb-3 text-sm font-bold">Materi Kelas 7</h2><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={onClass} className="rounded-2xl border border-[hsl(var(--guru-turquoise)/0.3)] bg-[hsl(var(--guru-turquoise-soft))] p-5 text-left"><BookOpen className="text-[hsl(var(--guru-turquoise))]" /><p className="mt-4 font-bold">Bangun Ruang Segitiga</p><p className="mt-1 text-xs text-muted-foreground">Unsur, luas permukaan, dan volume prisma segitiga.</p></button><button type="button" onClick={onClass} className="rounded-2xl border border-[hsl(var(--guru-sapphire)/0.3)] bg-[hsl(var(--guru-sapphire-soft))] p-5 text-left"><Target className="text-[hsl(var(--guru-sapphire))]" /><p className="mt-4 font-bold">Jenis-Jenis Garis</p><p className="mt-1 text-xs text-muted-foreground">Garis sejajar, berpotongan, tegak lurus, dan transversal.</p></button></div></section>
      <div className="grid gap-3 sm:grid-cols-3">{groups.map((group) => <div key={group.name} className="rounded-2xl border border-border bg-card p-4"><div className="flex justify-between"><b>{group.name}</b><span className="text-xs text-muted-foreground">{group.students} siswa</span></div><div className="mt-4 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-[hsl(var(--guru-turquoise))]" style={{ width: `${group.progress}%` }} /></div></div>)}</div>
    </div>
  );
}

function Classroom({ onBack, onTutor }: { onBack: () => void; onTutor: (topic: "Bangun Ruang Segitiga" | "Jenis-Jenis Garis") => void }) {
  return <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8"><button type="button" onClick={onBack} className="text-sm text-muted-foreground">Kembali ke Beranda</button><section className="rounded-3xl bg-gradient-to-br from-[hsl(var(--guru-sapphire))] to-[hsl(var(--guru-turquoise))] p-8 text-primary-foreground"><p className="text-sm">Ruang Kelas · VII-A</p><h1 className="mt-2 text-3xl font-black">Eksplorasi Geometri Kelas 7</h1></section><div className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-6"><BookOpen className="text-[hsl(var(--guru-turquoise))]" /><h2 className="mt-4 font-bold">Bangun Ruang Segitiga</h2><p className="mt-2 text-sm text-muted-foreground">Amati unsur prisma segitiga, luas permukaan, dan volumenya.</p><button type="button" onClick={() => onTutor("Bangun Ruang Segitiga")} className="mt-5 rounded-xl bg-[hsl(var(--guru-turquoise))] px-4 py-2 text-sm text-primary-foreground">Mulai aktivitas</button></article><article className="rounded-2xl border border-border bg-card p-6"><Target className="text-[hsl(var(--guru-sapphire))]" /><h2 className="mt-4 font-bold">Jenis-Jenis Garis</h2><p className="mt-2 text-sm text-muted-foreground">Kenali garis sejajar, berpotongan, tegak lurus, dan transversal.</p><button type="button" onClick={() => onTutor("Jenis-Jenis Garis")} className="mt-5 rounded-xl bg-[hsl(var(--guru-sapphire))] px-4 py-2 text-sm text-primary-foreground">Mulai aktivitas</button></article></div></div>;
}

export default function SiswaDashboard() {
  const [active, setActive] = useState("Beranda");
  const [mobile, setMobile] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [tutorTopic, setTutorTopic] = useState<"Bangun Ruang Segitiga" | "Jenis-Jenis Garis" | null>(null);
  const select = (value: string) => { setActive(value); setMobile(false); };
  const exitTutor = () => { setTutorTopic(null); setClassOpen(true); setActive("Ruang Kelas"); };
  if (tutorTopic) return <AITutorSession topic={tutorTopic} onExit={exitTutor} />;
  return <div className="flex h-screen overflow-hidden bg-[hsl(var(--guru-sapphire-soft))]"><Navigation active={active} open={mobile} onClose={() => setMobile(false)} onSelect={select}/>{mobile && <button type="button" aria-label="Tutup sidebar" onClick={() => setMobile(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"/>}<main className="min-w-0 flex-1 overflow-y-auto"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur"><button type="button" onClick={() => setMobile(true)} className="rounded-xl p-2 lg:hidden" aria-label="Buka menu"><Menu size={20}/></button><div className="hidden text-sm text-muted-foreground lg:block">MIRAI / <b className="text-foreground">{active}</b></div><span className="rounded-full bg-[hsl(var(--guru-yellow))] px-3 py-2 text-xs font-bold">AR · {siswaProfile.className}</span></header>{active === "Beranda" ? <StudentHome onClass={() => setClassOpen(true)}/> : active === "Ruang Kelas" || classOpen ? <Classroom onBack={() => { setClassOpen(false); setActive("Beranda"); }} onTutor={setTutorTopic}/> : <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center"><BookOpen size={56} className="text-[hsl(var(--guru-turquoise))]"/><h2 className="mt-5 text-3xl font-black">{active}</h2><p className="mt-2 text-sm text-muted-foreground">Halaman siswa kelas 7 sedang disiapkan.</p><button type="button" onClick={() => setActive("Beranda")} className="mt-6 rounded-xl bg-[hsl(var(--guru-turquoise))] px-5 py-3 text-sm text-primary-foreground">Kembali ke Beranda</button></div>}</main></div>;
}
