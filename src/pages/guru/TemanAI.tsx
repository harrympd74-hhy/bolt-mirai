import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizonal, Sparkles, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const suggestions = ["Rancang RPP interaktif", "Ide ice breaking kelas 7", "Buat soal latihan bangun ruang", "Tips mengelola kelas aktif"];

const demoReplies: { keywords: string[]; reply: string }[] = [
  { keywords: ["rpp", "rencana", "modul"], reply: "Untuk RPP Matematika kelas 7 semester ganjil, saya bisa bantu: (1) mulai dari tujuan pembelajaran berbasis Capaian Pembelajaran, (2) susun kegiatan pendahuluan 10 menit, inti 60 menit dengan model PBL, dan penutup 10 menit, (3) lampirkan instrumen asesmen formatif. Mau saya kembangkan sampai detail skenario kelasnya?" },
  { keywords: ["ice", "pemanasan", "games", "game"], reply: "Ide ice breaking untuk kelas 7: \"Tebak Bangun Ruang\" — siswa menebak nama bangun ruang dari isyarat tubuh temannya, atau \"Deret Berantai\" untuk latihan hitung cepat. Keduanya cocok dibuka 5–7 menit di awal pelajaran Matematika." },
  { keywords: ["soal", "latihan", "kuis", "quiz"], reply: "Contoh soal latihan sudut dan garis-garis sejajar untuk kelas 7: 1) Dua garis berpotongan membentuk sudut 35°, berapa sudut bertolak belakangnya? 2) Dua garis sejajar dipotong transversal membentuk sudut sehadap 60°, berapa sudut sehadap di titik potong lainnya? Saya bisa buatkan 10 soal berjenjang LOT–HOT–UP HOT sesuai alur belajar di MIRAI." },
  { keywords: ["kelas", "mengelola", "aktif", "disiplin"], reply: "Untuk kelas aktif kelas 7, coba terapkan 3 hal: aturan sinyal (tepuk/angka) untuk meminta fokus, rotasi peran siswa setiap pertemuan, dan apresiasi kelompok cepat. Di MIRAI, Ruang Kelas Aktif bisa membantu membagi siswa ke kelompok Tim Pengintai dan Tim Navigator." },
  { keywords: ["nilai", "penilaian", "asesmen"], reply: "Asesmen formatif bisa dilakukan lewat kuis singkat tiap akhir sesi. Gunakan rubrik sederhana: pemahaman konsep, ketepatan langkah, dan komunikasi matematis. Data nilai siswa kelas 7 bisa dilihat di menu Nilai pada dasbor." },
];

function getDemoReply(text: string): string {
  const lower = text.toLowerCase();
  const match = demoReplies.find((entry) => entry.keywords.some((keyword) => lower.includes(keyword)));
  return match?.reply ?? "Baik, saya bantu guru! Bisa jelaskan sedikit lagi kebutuhannya? Misalnya terkait materi matematika kelas 7, penyusunan RPP, soal latihan, atau pengelolaan kelas — nanti saya susunkan yang paling sesuai.";
}

export default function TemanAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Halo, Ibu/Bapak Guru! Saya Teman AI MIRAI. Tanyakan apa saja tentang materi kelas 7, RPP, soal latihan, atau pengelolaan kelas." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || typing) return;
    setMessages((previous) => [...previous, { role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((previous) => [...previous, { role: "ai", text: getDemoReply(value) }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold">Teman AI</h2>
            <p className="text-[10px] text-muted-foreground">Asisten guru · Matematika kelas 7</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--guru-yellow-soft))] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--guru-brown))]">
          <Sparkles className="h-3 w-3" /> UjiBetaversiMIrai
        </span>
      </div>

      <div ref={scrollRef} className="h-72 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "ai" && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]">
                <Bot className="h-3.5 w-3.5" />
              </span>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.role === "user" ? "rounded-br-sm bg-[hsl(var(--guru-turquoise))] text-primary-foreground" : "rounded-bl-sm bg-muted"}`}>
              {message.text}
            </div>
            {message.role === "user" && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]">
                <User className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${dot * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-0.5">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => send(suggestion)} className="shrink-0 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition hover:border-[hsl(var(--guru-turquoise))] hover:text-[hsl(var(--guru-turquoise))]">
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") send(input); }}
            placeholder="Tanyakan sesuatu pada Teman AI..."
            className="min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs outline-none transition focus:border-[hsl(var(--guru-turquoise))] focus:ring-2 focus:ring-[hsl(var(--guru-turquoise)/0.18)]"
          />
          <button type="button" onClick={() => send(input)} disabled={!input.trim() || typing} aria-label="Kirim" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--guru-turquoise))] text-primary-foreground transition hover:brightness-105 disabled:opacity-40">
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
