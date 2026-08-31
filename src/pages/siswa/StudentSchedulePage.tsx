import { ArrowLeft, BookOpen, UsersRound } from "lucide-react";
import ScheduleList from "@/components/shared/ScheduleList";

type Topic = "Sudut" | "Garis-Garis Sejajar";

export default function StudentSchedulePage({ onBack, onOpenMeeting }: { onBack: () => void; onOpenMeeting: (topic: Topic) => void }) {
  return <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><button type="button" onClick={onBack} className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft size={14} /> Kembali ke Beranda</button><h1 className="text-2xl font-black">Jadwal Semester</h1><p className="mt-1 text-sm text-muted-foreground">Jadwal ini sama dengan jadwal yang tampil di beranda siswa dan terhubung ke ruang pembelajaran guru.</p></div>
      <button type="button" onClick={() => onOpenMeeting("Sudut")} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"><UsersRound size={15} /> Ruang Pertemuan</button>
    </div>
    <ScheduleList title="Jadwal Semester · Kelas VII A" />
    <section className="grid gap-4 sm:grid-cols-2"><button type="button" onClick={() => onOpenMeeting("Sudut")} className="rounded-2xl border border-[hsl(var(--guru-turquoise)/0.3)] bg-[hsl(var(--guru-turquoise-soft)/0.45)] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"><BookOpen className="text-[hsl(var(--guru-turquoise))]" size={20} /><p className="mt-3 font-bold">Masuk Pertemuan Matematika</p><p className="mt-1 text-xs text-muted-foreground">Buka ruang pembelajaran aktif yang disiapkan guru.</p></button><button type="button" onClick={() => onOpenMeeting("Garis-Garis Sejajar")} className="rounded-2xl border border-[hsl(var(--guru-sapphire)/0.3)] bg-[hsl(var(--guru-sapphire-soft)/0.45)] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"><BookOpen className="text-[hsl(var(--guru-sapphire))]" size={20} /><p className="mt-3 font-bold">Lanjutkan Materi</p><p className="mt-1 text-xs text-muted-foreground">Terhubung ke materi dan aktivitas ruang guru.</p></button></section>
  </div>;
}
