import { motion } from "framer-motion";
import { Bot, Cpu, Database, GraduationCap, HeartHandshake, LineChart, Sparkles } from "lucide-react";

const orbit = [
  { label: "Guru", icon: GraduationCap, color: "bg-[hsl(var(--tamu-green)/0.16)] text-[hsl(var(--tamu-green))] border-[hsl(var(--tamu-green)/0.3)]", x: 78, y: 30 },
  { label: "AI Tutor MIRAI", icon: Bot, color: "bg-[hsl(var(--tamu-purple)/0.18)] text-[hsl(var(--tamu-purple))] border-[hsl(var(--tamu-purple)/0.35)]", x: 50, y: 14 },
  { label: "Tutor Sebaya", icon: HeartHandshake, color: "bg-[hsl(var(--tamu-orange)/0.16)] text-[hsl(var(--tamu-orange))] border-[hsl(var(--tamu-orange)/0.32)]", x: 78, y: 70 },
  { label: "Orang Tua", icon: Sparkles, color: "bg-[hsl(var(--tamu-sky)/0.16)] text-[hsl(var(--tamu-sky))] border-[hsl(var(--tamu-sky)/0.32)]", x: 50, y: 86 },
  { label: "Data", icon: Database, color: "bg-[hsl(var(--tamu-sky)/0.16)] text-[hsl(var(--tamu-sky))] border-[hsl(var(--tamu-sky)/0.32)]", x: 22, y: 70 },
  { label: "Teknologi", icon: Cpu, color: "bg-[hsl(var(--tamu-purple)/0.18)] text-[hsl(var(--tamu-purple))] border-[hsl(var(--tamu-purple)/0.35)]", x: 22, y: 30 },
];

const connectorLines = [
  { x1: 240, y1: 240, x2: 240, y2: 67.2 },
  { x1: 240, y1: 240, x2: 374.4, y2: 144 },
  { x1: 240, y1: 240, x2: 374.4, y2: 336 },
  { x1: 240, y1: 240, x2: 240, y2: 412.8 },
  { x1: 240, y1: 240, x2: 105.6, y2: 336 },
  { x1: 240, y1: 240, x2: 105.6, y2: 144 },
];

export default function Hero() {
  return (
    <section className="tamu-hero-bg relative overflow-hidden">
      <div className="tamu-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[hsl(var(--tamu-sky)/0.25)] blur-[100px]" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[hsl(var(--tamu-purple)/0.3)] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--tamu-orange))]" /> SMART DIGITAL LEARNING ECOSYSTEM
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ekosistem Pembelajaran
            <span className="tamu-title-gradient block">Adaptif, Personal, Kolaboratif</span>
            <span className="text-white/90">dan Bermakna.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            MIRAI menyatukan siswa, guru, orang tua, dan teknologi cerdas dalam satu ekosistem belajar digital — dengan AI Tutor sebagai pendamping, data sebagai panduan, dan kolaborasi sebagai kunci pertumbuhan.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[hsl(var(--tamu-green)/0.35)] bg-[hsl(var(--tamu-green)/0.12)] px-4 py-2.5 text-sm font-semibold text-white">
            <LineChart className="h-4 w-4 text-[hsl(var(--tamu-green))]" />
            Belajar Mandiri — Berkolaborasi — Merefleksi — Bertumbuh
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#stats" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[hsl(var(--tamu-navy))] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">Lihat Statistik Ekosistem</a>
            <a href="/" className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20">Kembali ke Beranda</a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.25 }} className="relative mx-auto aspect-square w-full max-w-[480px]">
          <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="240" cy="240" r="200" fill="none" stroke="hsl(var(--tamu-sky) / 0.18)" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="240" cy="240" r="150" fill="none" stroke="hsl(var(--tamu-purple) / 0.16)" strokeWidth="1.5" strokeDasharray="2 10" />
            {connectorLines.map((line) => (
              <line key={`${line.x1}-${line.y2}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="hsl(var(--tamu-sky) / 0.28)" strokeWidth="1.5" />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="tamu-center-node flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/40 shadow-2xl shadow-[hsl(var(--tamu-sky)/0.35)]">
              <div className="text-center">
                <p className="font-display text-xl font-extrabold text-white">Siswa</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-white/70">Pusat Belajar</p>
              </div>
            </div>
          </div>

          {orbit.map((node, index) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur ${node.color}`}
              >
                <node.icon className="h-5 w-5" />
                <span className="whitespace-nowrap text-[11px] font-bold">{node.label}</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
