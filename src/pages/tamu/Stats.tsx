import { motion } from "framer-motion";
import { Activity, Bot, CheckCircle2, ClipboardCheck, GraduationCap, Handshake } from "lucide-react";

const stats = [
  { label: "Total Siswa", value: "487", note: "Seluruh jenjang", icon: GraduationCap, tone: "bg-[hsl(var(--tamu-sky-soft))] text-[hsl(var(--tamu-sky))]" },
  { label: "Kelas Aktif", value: "18", note: "Kelas 7 · Matematika", icon: ClipboardCheck, tone: "bg-[hsl(var(--tamu-green-soft))] text-[hsl(var(--tamu-green))]" },
  { label: "Aktivitas / Minggu", value: "4.250", note: "Belajar & tugas", icon: Activity, tone: "bg-[hsl(var(--tamu-orange-soft))] text-[hsl(var(--tamu-orange))]" },
  { label: "Interaksi AI Tutor", value: "12.800", note: "Sesi tanya jawab", icon: Bot, tone: "bg-[hsl(var(--tamu-purple-soft))] text-[hsl(var(--tamu-purple))]" },
  { label: "Partisipasi Orang Tua", value: "68%", note: "Pemantauan aktif", icon: Handshake, tone: "bg-[hsl(var(--tamu-sky-soft))] text-[hsl(var(--tamu-sky))]" },
  { label: "Penyelesaian Tugas", value: "87%", note: "Tepat waktu", icon: CheckCircle2, tone: "bg-[hsl(var(--tamu-green-soft))] text-[hsl(var(--tamu-green))]" },
];

export default function Stats() {
  return (
    <section id="stats" className="relative scroll-mt-16 bg-[hsl(var(--tamu-sky-soft)/0.5)] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[hsl(var(--tamu-sky))]">Ekosistem dalam Angka</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-[hsl(var(--tamu-navy))] sm:text-4xl">Statistik Agregat Ekosistem</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Data agregat tingkat sekolah — tanpa data pribadi, nilai individu, atau informasi sensitif.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(({ label, value, note, icon: Icon, tone }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="tamu-glow-card rounded-3xl border border-white/70 bg-white p-5 transition hover:-translate-y-1"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
              <p className="font-display mt-4 text-2xl font-extrabold text-[hsl(var(--tamu-navy))] sm:text-3xl">{value}</p>
              <p className="mt-0.5 text-xs font-bold text-foreground">{label}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
