import { useState } from "react";
import { AlertCircle, Bot, CheckCircle2, Eye, EyeOff, Info, RefreshCw, Save, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ProviderId = "claude" | "gpt" | "gemini";
type Provider = { id: ProviderId; name: string; vendor: string; model: string; accent: string; active: boolean; apiKey: string; temperature: number; maxTokens: number; topP: number };

const defaults: Provider[] = [
  { id: "claude", name: "Claude", vendor: "Anthropic", model: "claude-3-5-sonnet-20241022", accent: "purple", active: false, apiKey: "", temperature: 0.7, maxTokens: 2048, topP: 0.9 },
  { id: "gpt", name: "GPT", vendor: "OpenAI", model: "gpt-4o", accent: "sky", active: false, apiKey: "", temperature: 0.7, maxTokens: 2048, topP: 0.9 },
  { id: "gemini", name: "Gemini", vendor: "Google", model: "gemini-1.5-flash", accent: "gold", active: true, apiKey: "••••••••••••••••••••••••••••••••", temperature: 0.7, maxTokens: 2048, topP: 0.9 },
];

const accents: Record<string, { icon: string; soft: string; border: string; text: string; button: string }> = {
  purple: { icon: "bg-[hsl(264_80%_94%)] text-[hsl(264_70%_58%)]", soft: "bg-[hsl(264_80%_97%)]", border: "border-border", text: "text-foreground", button: "bg-muted text-muted-foreground" },
  sky: { icon: "bg-[hsl(200_90%_92%)] text-[hsl(200_80%_46%)]", soft: "bg-[hsl(200_90%_97%)]", border: "border-border", text: "text-foreground", button: "bg-muted text-muted-foreground" },
  gold: { icon: "bg-[hsl(45_100%_88%)] text-[hsl(35_80%_45%)]", soft: "bg-[hsl(45_100%_96%)]", border: "border-[hsl(80_48%_45%)]", text: "text-foreground", button: "bg-[hsl(161_80%_35%)] text-primary-foreground" },
};

export default function AIConnector() {
  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem("mirai_ai_connector_settings");
    if (!saved) return defaults;
    try { return defaults.map((provider) => ({ ...provider, ...JSON.parse(saved)[provider.id] })); } catch { return defaults; }
  });
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState<ProviderId | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const update = (id: ProviderId, field: keyof Provider, value: string | number | boolean) => {
    setProviders((current) => current.map((provider) => provider.id === id ? { ...provider, [field]: value } : provider));
  };

  const activate = (id: ProviderId) => {
    setProviders((current) => current.map((provider) => ({ ...provider, active: provider.id === id })));
    setMessage(`${id === "gemini" ? "Gemini" : id === "gpt" ? "GPT" : "Claude"} dipilih sebagai provider aktif.`);
    setError(false);
  };

  const testConnection = async (provider: Provider) => {
    setTesting(provider.id); setMessage(""); setError(false);
    if (provider.id !== "gemini") {
      setMessage("Provider ini belum dikonfigurasi. Gemini tersedia sebagai provider aktif."); setError(true); setTesting(null); return;
    }
    const started = performance.now();
    const { error: invokeError } = await supabase.functions.invoke("ai-tutor", { body: { messages: [{ role: "user", content: "Balas hanya dengan kata OK." }], model: provider.model, temperature: 0, maxTokens: 16, topP: 1 } });
    const latency = Math.round(performance.now() - started);
    setTesting(null);
    if (invokeError) { setMessage(`Koneksi Gemini gagal: ${invokeError.message}`); setError(true); return; }
    setProviders((current) => current.map((item) => item.id === provider.id ? { ...item, active: true } : item));
    setMessage(`Koneksi Gemini berhasil. Respons diterima dalam ${latency} ms.`);
  };

  const saveSettings = () => {
    const payload = Object.fromEntries(providers.map(({ id, model, active, temperature, maxTokens, topP }) => [id, { model, active, temperature, maxTokens, topP }]));
    localStorage.setItem("mirai_ai_connector_settings", JSON.stringify(payload));
    setMessage("Pengaturan berhasil disimpan. AI Tutor MIRAI siap digunakan."); setError(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--guru-sapphire-deep))] text-primary-foreground"><Bot className="h-5 w-5" /></span>AI Connector</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Pilih satu AI yang akan digunakan sebagai AI Tutor dan Teman AI. Hanya satu provider yang bisa aktif.</p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[hsl(200_80%_78%)] bg-[hsl(200_90%_96%)] px-4 py-3 text-xs text-[hsl(200_55%_35%)]"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>Mengaktifkan satu provider akan otomatis menonaktifkan provider lain. Daftar model muncul setelah API Key provider terhubung.</p></div>

      <div className="grid gap-5 xl:grid-cols-3">
        {providers.map((provider) => {
          const theme = accents[provider.accent];
          const isGemini = provider.id === "gemini";
          return <article key={provider.id} className={`rounded-2xl border-2 ${provider.active ? theme.border : "border-border"} ${theme.soft} p-5 shadow-sm transition`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.icon}`}><Bot className="h-5 w-5" /></span><div><h3 className="font-bold">{provider.name}</h3><p className="text-xs text-muted-foreground">{provider.vendor}</p></div></div>
              <button type="button" onClick={() => activate(provider.id)} aria-label={`Aktifkan ${provider.name}`} className={`relative h-6 w-11 rounded-full transition ${provider.active ? "bg-[hsl(161_80%_35%)]" : "bg-muted-foreground/25"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow transition ${provider.active ? "right-1" : "left-1"}`} /></button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-medium"><span className={`h-1.5 w-1.5 rounded-full ${provider.active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />{provider.active ? "Aktif" : "Tidak Aktif"}</div>

            <label className="mt-5 block text-xs font-semibold">Masa Aktif Hingga<div className="mt-2 rounded-lg border border-border bg-card/70 px-3 py-3 text-xs text-muted-foreground">{provider.active ? "Dikelola aman oleh Enter Cloud" : "Terisi otomatis saat provider terhubung"}</div></label>
            <p className="mt-2 text-[10px] italic text-muted-foreground">Ditetapkan otomatis oleh sistem saat AI aktif & terhubung.</p>

            <label className="mt-5 block text-xs font-semibold">API Key
              <div className="relative mt-2"><input type={showKey && isGemini ? "text" : "password"} value={provider.apiKey} readOnly={isGemini} onChange={(event) => update(provider.id, "apiKey", event.target.value)} placeholder={`Masukkan API Key ${provider.name}...`} className="w-full rounded-lg border border-border bg-card px-3 py-3 pr-10 text-xs outline-none focus:border-[hsl(var(--guru-turquoise))]" /><button type="button" onClick={() => setShowKey((current) => !current)} aria-label="Tampilkan API key" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye className="h-4 w-4" /></button></div>
            </label>
            {isGemini && <p className="mt-2 text-[10px] italic text-muted-foreground">API Key Gemini tersimpan aman di backend. Key tidak pernah dikirim ke browser siswa.</p>}

            <div className="mt-6 space-y-4">
              {([["Temperature", provider.temperature, 0, 1, 0.1], ["Max Tokens", provider.maxTokens, 256, 8192, 256], ["Top P", provider.topP, 0, 1, 0.1]] as const).map(([label, value, min, max, step]) => <label key={label} className="block text-xs font-semibold"> <span className="flex justify-between"><span>{label}</span><span className="font-mono text-[hsl(var(--guru-turquoise))]">{label === "Max Tokens" ? value : Number(value).toFixed(1)}</span></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => update(provider.id, label === "Max Tokens" ? "maxTokens" : label === "Temperature" ? "temperature" : "topP", Number(event.target.value))} className="mt-2 w-full accent-[hsl(var(--guru-turquoise))]" /></label>)}
            </div>

            <div className="mt-6 flex gap-2 border-t border-border/70 pt-4"><button type="button" onClick={() => testConnection(provider)} disabled={testing !== null} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-3 text-xs font-semibold text-foreground disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${testing === provider.id ? "animate-spin" : ""}`} />Test Koneksi</button><button type="button" onClick={saveSettings} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-bold ${theme.button}`}><Save className="h-3.5 w-3.5" />Simpan Pengaturan</button></div>
          </article>;
        })}
      </div>

      {message && <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${error ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{message}</div>}
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-[hsl(var(--guru-yellow))]" /> Gemini aktif menjadi provider AI Tutor MIRAI. Provider lain dapat diaktifkan setelah secret masing-masing dikonfigurasi.</p>
    </div>
  );
}
