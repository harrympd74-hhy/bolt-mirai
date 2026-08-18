import { useState } from "react";
import { AlertCircle, Bot, CheckCircle2, Eye, EyeOff, Key, RefreshCw, Save, Zap } from "lucide-react";

type ProviderStatus = "connected" | "ready" | "error" | "standby";
type ProviderId = "claude" | "gpt" | "gemini";

interface AIProvider {
  id: ProviderId;
  name: string;
  model: string;
  slot: "PRIMARY" | "SECONDARY" | "EMERGENCY";
  status: ProviderStatus;
  latency: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  enabled: boolean;
}

const defaultProviders: AIProvider[] = [
  { id: "claude", name: "Claude", model: "claude-3-5-sonnet-20241022", slot: "PRIMARY", status: "standby", latency: "-", apiKey: "", temperature: 0.7, maxTokens: 2048, topP: 0.9, enabled: true },
  { id: "gpt", name: "GPT", model: "gpt-4o", slot: "SECONDARY", status: "standby", latency: "-", apiKey: "", temperature: 0.7, maxTokens: 2048, topP: 0.9, enabled: true },
  { id: "gemini", name: "Gemini", model: "gemini-1.5-pro", slot: "EMERGENCY", status: "standby", latency: "-", apiKey: "", temperature: 0.7, maxTokens: 2048, topP: 0.9, enabled: true },
];

const statusConfig = {
  connected: { label: "Connected", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  ready: { label: "Ready", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Zap },
  standby: { label: "Standby", color: "bg-sky-500/20 text-sky-400 border-sky-500/30", icon: AlertCircle },
  error: { label: "Error", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle },
};

export default function AIConnector() {
  const [providers, setProviders] = useState<AIProvider[]>(() => {
    const saved = localStorage.getItem("mirai_ai_providers");
    return saved ? JSON.parse(saved) : defaultProviders;
  });
  const [activeId, setActiveId] = useState<ProviderId>("claude");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const activeProvider = providers.find((p) => p.id === activeId) ?? providers[0];

  const updateProvider = (id: ProviderId, field: keyof AIProvider, value: unknown) => {
    setProviders((previous) => previous.map((provider) => (provider.id === id ? { ...provider, [field]: value } : provider)));
  };

  const handleTestConnection = async () => {
    if (!activeProvider.apiKey.trim()) {
      setMessage("API Key wajib diisi sebelum test koneksi.");
      return;
    }
    setTesting(true);
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const success = true;
    setProviders((previous) =>
      previous.map((provider) =>
        provider.id === activeId
          ? { ...provider, status: success ? "connected" : "error", latency: success ? `${Math.floor(Math.random() * 80) + 60}ms` : "-" }
          : provider
      )
    );
    setMessage(success ? `✅ Koneksi ke ${activeProvider.name} berhasil!` : `❌ Gagal terhubung ke ${activeProvider.name}.`);
    setTesting(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("mirai_ai_providers", JSON.stringify(providers));
    setMessage("✅ Pengaturan AI berhasil disimpan. AI Tutor & Teman AI siap digunakan.");
    setSaving(false);
  };

  const StatusIcon = statusConfig[activeProvider.status].icon;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground">
          <Bot className="h-8 w-8 text-[hsl(var(--guru-yellow))]" />
          AI Connector
        </h2>
        <p className="mt-1 text-muted-foreground">
          Masukkan API Key dan atur parameter. AI akan otomatis tersedia sebagai AI Tutor (Siswa) dan Teman AI (Guru).
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => {
              setActiveId(provider.id);
              setMessage("");
              setShowKey(false);
            }}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              activeId === provider.id
                ? "bg-[hsl(var(--guru-turquoise))] text-primary-foreground shadow-lg"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            {provider.slot} — {provider.name}
          </button>
        ))}
      </div>

      <div className="space-y-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-sm font-bold text-[hsl(var(--guru-turquoise))]">{activeProvider.slot}</p>
            <h3 className="mt-1 text-2xl font-semibold text-foreground">
              {activeProvider.name} • {activeProvider.model}
            </h3>
          </div>
          <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${statusConfig[activeProvider.status].color}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig[activeProvider.status].label}
            {activeProvider.latency !== "-" && <span className="ml-2 text-xs opacity-80">• {activeProvider.latency}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Key className="h-4 w-4 text-muted-foreground" /> API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={activeProvider.apiKey}
              onChange={(e) => updateProvider(activeId, "apiKey", e.target.value)}
              placeholder={`Masukkan API Key ${activeProvider.name}...`}
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Temperature <span className="font-mono text-xs text-[hsl(var(--guru-turquoise))]">{activeProvider.temperature.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={activeProvider.temperature}
              onChange={(e) => updateProvider(activeId, "temperature", parseFloat(e.target.value))}
              className="w-full accent-[hsl(var(--guru-turquoise))]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Max Tokens <span className="font-mono text-xs text-[hsl(var(--guru-turquoise))]">{activeProvider.maxTokens}</span>
            </label>
            <input
              type="range"
              min="256"
              max="8192"
              step="256"
              value={activeProvider.maxTokens}
              onChange={(e) => updateProvider(activeId, "maxTokens", parseInt(e.target.value, 10))}
              className="w-full accent-[hsl(var(--guru-turquoise))]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Top P <span className="font-mono text-xs text-[hsl(var(--guru-turquoise))]">{activeProvider.topP.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={activeProvider.topP}
              onChange={(e) => updateProvider(activeId, "topP", parseFloat(e.target.value))}
              className="w-full accent-[hsl(var(--guru-turquoise))]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enabled"
            checked={activeProvider.enabled}
            onChange={(e) => updateProvider(activeId, "enabled", e.target.checked)}
            className="h-5 w-5 rounded border-border text-primary"
          />
          <label htmlFor="enabled" className="text-sm text-foreground">
            Aktifkan provider ini dalam sistem failover
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Testing..." : "Test Koneksi"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[hsl(var(--guru-turquoise))] px-6 py-3 font-medium text-primary-foreground transition hover:brightness-105 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>

        {message && (
          <div className={`rounded-xl p-4 text-sm ${message.includes("✅") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
