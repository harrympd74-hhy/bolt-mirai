import { Bell, CalendarDays, ChevronRight, ClipboardList, MessageSquareText, Sparkles, TrendingUp, Users } from "lucide-react";

interface BerandaProps { onNavigate: (id: string) => void; }

const schedule = [
  { day: "Senin", subject: "Sudut", time: "07.30 – 09.00", teacher: "Guru Matematika" },
  { day: "Senin", subject: "Garis-Garis Sejajar", time: "09.15 – 10.45", teacher: "Guru Matematika" },
  { day: "Rabu", subject: "Latihan Sudut dan Garis", time: "10.45 – 12.00", teacher: "Guru Matematika" },
] as const;

const notes = [
  { teacher: "Guru Matematika", text: "Ahmad aktif bertanya di kelas hari ini dan menunjukkan pemahaman yang baik pada materi sudut.", time: "Hari ini · 11.20 WIB" },
  { teacher: "Wali Kelas VII-A", text: "Mohon dukungan orang tua agar Ahmad lebih teliti saat mengerjakan soal cerita.", time: "Kemarin · 15.05 WIB" },
] as const;

const quickActions = [
  { id: "profil-anak", label: "Profil Anak", caption: "Data diri & kelas", icon: Users },
  { id: "perkembangan", label: "Perkembangan Siswa", caption: "Progres belajar", icon: TrendingUp },
  { id: "angket-kinerja", label: "Angket Kinerja", caption: "Isi penilaian", icon: ClipboardList },
  { id: "catatan-guru", label: "Catatan Guru", caption: "Pesan dari guru", icon: MessageSquareText },
] as const;

const iconTone = "bg-[hsl(var(--ortu-cream-soft))] text-[hsl(var(--ortu-brown))]";

export default function Beranda({ onNavigate }: BerandaProps) {
  const day = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="mx-auto max-w-[1200px] space-y-5 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--ortu-gold))] text-xs font-bold text-[hsl(var(--ortu-brown))]">IR</span>
          <div>
            <p className="text-sm font-bold">Ibu Ratna</p>
            <p className="text-[10px] text-muted-foreground">Orang tua dari Ahmad Rizki Pratama</p>
          </div>
        </div>
        <button type="button" aria-label="Notifikasi" className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-foreground"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--ortu-gold))]" /></button>
      </div>

      <section className="ortu-hero relative overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-lg sm:p-7">
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-medium text-primary-foreground/70">{day}</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Pantau Perkembangan<br />Anak Anda dengan Tenang.</h1>
          <p className="mt-2 max-w-md text-sm text-primary-foreground/70">Ahmad sedang belajar materi sudut dan garis-garis sejajar di SMP kelas 7. Semua perkembangan belajar terpantau di sini.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">Ahmad Rizki Pratama</span>
            <span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">Kelas VII-A</span>
            <span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold">SMPN 1 Bandung</span>
          </div>
        </div>
        <div className="absolute -right-8 -top-16 h-52 w-52 rounded-full border-[28px] border-primary-foreground/10" />
        <div className="absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[22px] border-[hsl(var(--ortu-gold)/0.4)]" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[hsl(var(--ortu-brown))]" />
              <h2 className="text-sm font-bold">Jadwal Anak Minggu Ini</h2>
            </div>
            <button type="button" onClick={() => onNavigate("perkembangan")} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">Lihat semua <ChevronRight className="h-3 w-3" /></button>
          </div>
          <div className="divide-y divide-border">
            {schedule.map((item) => (
              <div key={`${item.day}-${item.subject}`} className="flex items-center justify-between gap-2 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-14 shrink-0 rounded-lg bg-[hsl(var(--ortu-cream-soft))] px-2 py-1 text-center text-[10px] font-bold text-[hsl(var(--ortu-brown))]">{item.day}</span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{item.subject}</p>
                    <p className="text-[10px] text-muted-foreground">{item.teacher}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-[hsl(var(--ortu-gold))]" />
              <h2 className="text-sm font-bold">Catatan Guru</h2>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--ortu-gold-soft))] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--ortu-brown))]"><Sparkles className="h-3 w-3" /> 2 baru</span>
          </div>
          <div className="space-y-3 text-xs">
            {notes.map((note) => (
              <div key={`${note.teacher}-${note.time}`} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="font-semibold text-[hsl(var(--ortu-brown))]">{note.teacher}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{note.text}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{note.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Akses Cepat</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map(({ id, label, caption, icon: Icon }) => (
            <button key={id} type="button" onClick={() => onNavigate(id)} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`rounded-xl p-2 ${iconTone}`}><Icon className="h-5 w-5" /></span>
              <span>
                <span className="block text-xs font-bold">{label}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">{caption}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
