import { ArrowRight, Construction, GraduationCap } from "lucide-react";
import Hero from "./tamu/Hero";
import Stats from "./tamu/Stats";

const logoUrl = "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/03d27ec3-8a8f-4d.png";

export default function GuestDashboard() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[hsl(var(--tamu-navy)/0.92)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo MIRAI" className="h-10 w-10 rounded-xl border border-white/25 bg-white p-1 object-contain" crossOrigin="anonymous" />
            <div className="min-w-0">
              <p className="font-display truncate text-sm font-extrabold tracking-wide text-white">SMART DIGITAL LEARNING ECOSYSTEM</p>
              <p className="hidden truncate text-[10px] text-white/60 sm:block">Ekosistem Pembelajaran Adaptif, Personal, Kolaboratif, dan Bermakna</p>
            </div>
          </div>
          <a href="/" className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20">
            <GraduationCap className="h-4 w-4" /> Masuk Sistem <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main>
        <Hero />
        <Stats />

        <section className="border-t border-dashed border-border bg-white py-16">
          <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--tamu-orange-soft))] text-[hsl(var(--tamu-orange))]">
              <Construction className="h-7 w-7" />
            </span>
            <h2 className="font-display mt-5 text-2xl font-extrabold text-[hsl(var(--tamu-navy))]">Tahap 2 & 3 Menyusul</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Learning Journey, Peran AI Tutor MIRAI, Mekanisme Productive Struggle, Infografis Dampak, Diagram Ekosistem Kolaborasi, Empat Pilar, dan banner penutup akan hadir di tahap berikutnya.
            </p>
          </div>
        </section>
      </main>

      <footer className="tamu-hero-bg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo MIRAI" className="h-9 w-9 rounded-lg border border-white/25 bg-white p-0.5 object-contain" crossOrigin="anonymous" />
            <div>
              <p className="font-display text-sm font-extrabold text-white">MIRAI</p>
              <p className="text-[10px] text-white/60">Smart Digital Learning Ecosystem · SMP Kelas 7</p>
            </div>
          </div>
          <p className="max-w-md text-right text-[10px] leading-relaxed text-white/55">
            Data agregat untuk keperluan publikasi — tidak menampilkan data pribadi, nilai individu, ranking, atau informasi sensitif.
          </p>
        </div>
      </footer>
    </div>
  );
}
