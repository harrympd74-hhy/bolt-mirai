import { useState, useCallback, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  CheckCircle2,
  XCircle,
  Loader2,
  Bot,
  Sparkles,
  Gem,
  Info,
  X,
  CalendarClock,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================================
// Types
// ============================================================

type ProviderId = 'claude' | 'gpt' | 'gemini';
type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface ProviderState {
  apiKey: string;
  showKey: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  testStatus: TestStatus;
  savedAt: string | null;
  /** Tanggal masa aktif berakhir (ISO yyyy-mm-dd). Kosong = tidak ada batas. */
  expiresAt: string;
  /** True jika expiresAt terisi otomatis oleh sistem (bukan input manual admin). */
  expiryAutoFilled: boolean;
}

interface ProviderMeta {
  id: ProviderId;
  name: string;
  vendor: string;
  models: string[];
  icon: React.ComponentType<{ className?: string }>;
  accent: {
    ring: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
  };
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

// ============================================================
// Static config
// ============================================================

const PROVIDER_META: ProviderMeta[] = [
  {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
    ],
    icon: Sparkles,
    accent: {
      ring: 'ring-violet-500',
      badgeBg: 'bg-violet-50',
      badgeText: 'text-violet-700',
      iconBg: 'bg-violet-100',
      iconText: 'text-violet-600',
    },
  },
  {
    id: 'gpt',
    name: 'GPT',
    vendor: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    icon: Bot,
    accent: {
      ring: 'ring-sky-500',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      iconBg: 'bg-sky-100',
      iconText: 'text-sky-600',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    models: ['gemini-3.5-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    icon: Gem,
    accent: {
      ring: 'ring-amber-500',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
    },
  },
];

const DEFAULT_PROVIDER_STATE = (models: string[]): ProviderState => ({
  apiKey: '',
  showKey: false,
  model: models[0],
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  testStatus: 'idle',
  savedAt: null,
  expiresAt: '',
  expiryAutoFilled: false,
});

/** True jika expiresAt terisi dan tanggalnya sudah lewat hari ini. */
function isExpired(expiresAt: string): boolean {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(expiresAt) < today;
}

/** Jumlah hari tersisa sampai expiresAt. null jika tidak diisi, negatif jika sudah lewat. */
function daysUntilExpiry(expiresAt: string): number | null {
  if (!expiresAt) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiresAt);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

/** Jendela masa tenggang: peringatan muncul H-7 sebelum masa aktif habis. */
const GRACE_PERIOD_DAYS = 7;

/** Default lama masa aktif yang otomatis diisi saat test koneksi berhasil.
 *  Asumsi 30 hari — sesuaikan begitu terhubung ke data billing/kuota API asli. */
const AUTO_EXPIRY_DAYS = 30;

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatIndoDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ============================================================
// Toast
// ============================================================

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
      {toasts.map((t) => {
        const styles =
          t.type === 'success'
            ? 'bg-emerald-600'
            : t.type === 'error'
            ? 'bg-rose-600'
            : 'bg-slate-800';
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;
        return (
          <div
            key={t.id}
            className={`${styles} text-white rounded-xl shadow-lg px-4 py-3 flex items-start gap-3`}
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium leading-snug flex-1">{t.text}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-white/80 hover:text-white shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Reusable slider row
// ============================================================

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  disabled: boolean;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-mono text-emerald-700">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

// ============================================================
// Provider Card
// ============================================================

function ProviderCard({
  meta,
  state,
  isActive,
  onActivate,
  onChange,
  onTest,
  onSave,
  saving,
}: {
  meta: ProviderMeta;
  state: ProviderState;
  isActive: boolean;
  onActivate: () => void;
  onChange: (patch: Partial<ProviderState>) => void;
  onTest: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const Icon = meta.icon;
  const hasKey = state.apiKey.trim().length > 0;
  const showModelPicker = hasKey;
  const expired = isExpired(state.expiresAt);
  const daysLeft = daysUntilExpiry(state.expiresAt);
  const inGrace =
    !expired && daysLeft !== null && daysLeft >= 0 && daysLeft <= GRACE_PERIOD_DAYS;
  const effectiveActive = isActive && !expired;
  const errorText =
    isActive && !hasKey ? 'Wajib diisi karena provider ini aktif.' : null;

  return (
    <div
      className={`rounded-2xl border bg-white transition-all ${
        effectiveActive
          ? `border-emerald-500 ring-1 ${meta.accent.ring} shadow-sm shadow-emerald-100`
          : isActive && expired
          ? 'border-amber-400 ring-1 ring-amber-300'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-6 pt-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.accent.iconBg}`}
          >
            <Icon className={`w-5 h-5 ${meta.accent.iconText}`} />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 leading-tight">
              {meta.name}
            </p>
            <p className="text-xs text-slate-500">{meta.vendor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isActive && inGrace && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-1 text-[11px] font-medium">
              <AlertTriangle className="w-3 h-3" />
              {daysLeft === 0 ? 'Habis hari ini' : `Tenggang ${daysLeft} hr`}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              effectiveActive
                ? 'bg-emerald-50 text-emerald-700'
                : isActive && expired
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                effectiveActive
                  ? 'bg-emerald-500'
                  : isActive && expired
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            {effectiveActive ? 'Aktif' : isActive && expired ? 'Kedaluwarsa' : 'Tidak Aktif'}
          </span>

          <button
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Aktifkan ${meta.name} sebagai provider`}
            onClick={onActivate}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
              isActive ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5 space-y-5">
        {isActive && expired && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Masa aktif provider ini sudah habis. Sistem otomatis
              memperlakukan provider ini sebagai tidak aktif sampai masa
              aktif diperpanjang.
            </p>
          </div>
        )}

        {isActive && !expired && inGrace && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Masa tenggang: tinggal{' '}
              {daysLeft === 0 ? 'hari ini' : `${daysLeft} hari lagi`} sebelum
              masa aktif habis ({formatIndoDate(state.expiresAt)}). Segera
              perpanjang agar AI Tutor dan Teman AI tidak terganggu.
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
            Masa Aktif Hingga
          </label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 flex items-center justify-between">
            {state.expiresAt ? (
              <>
                <span className="font-medium">{formatIndoDate(state.expiresAt)}</span>
                {state.expiryAutoFilled && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Otomatis dari AI
                  </span>
                )}
              </>
            ) : (
              <span className="text-slate-400 italic">
                Terisi otomatis saat AI terhubung dengan MIRAI
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0" />
            Ditetapkan otomatis oleh sistem saat AI aktif & terhubung. Hanya
            terlihat di Dashboard Admin.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            API Key
          </label>
          <div className="relative">
            <input
              type={state.showKey ? 'text' : 'password'}
              value={state.apiKey}
              onChange={(e) =>
                onChange({ apiKey: e.target.value, testStatus: 'idle' })
              }
              placeholder={`Masukkan API Key ${meta.name}...`}
              className={`w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${
                errorText ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => onChange({ showKey: !state.showKey })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={state.showKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
            >
              {state.showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errorText && (
            <p className="text-xs text-rose-600 mt-1.5">{errorText}</p>
          )}
        </div>

        {showModelPicker ? (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Model
            </label>
            <select
              value={state.model}
              onChange={(e) => onChange({ model: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            >
              {meta.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Masukkan API Key untuk menampilkan daftar model.
          </p>
        )}

        <div className="space-y-4 pt-1">
          <SliderRow
            label="Temperature"
            value={state.temperature}
            min={0}
            max={1}
            step={0.1}
            disabled={!hasKey}
            onChange={(v) => onChange({ temperature: v })}
            format={(v) => v.toFixed(1)}
          />
          <SliderRow
            label="Max Tokens"
            value={state.maxTokens}
            min={256}
            max={8192}
            step={256}
            disabled={!hasKey}
            onChange={(v) => onChange({ maxTokens: v })}
          />
          <SliderRow
            label="Top P"
            value={state.topP}
            min={0}
            max={1}
            step={0.05}
            disabled={!hasKey}
            onChange={(v) => onChange({ topP: v })}
            format={(v) => v.toFixed(2)}
          />
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onTest}
            disabled={!hasKey || state.testStatus === 'testing'}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {state.testStatus === 'testing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Test Koneksi
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Pengaturan
          </button>

          {state.testStatus === 'success' && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Terhubung
            </span>
          )}
          {state.testStatus === 'error' && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <XCircle className="w-4 h-4" />
              Gagal
            </span>
          )}
        </div>

        {state.savedAt && (
          <p className="text-xs text-slate-400">
            Terakhir disimpan: {state.savedAt}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function AIConnectorPage() {
  const [activeProvider, setActiveProvider] = useState<ProviderId | null>(
    'claude'
  );
  const [modeDemoDismissed, setModeDemoDismissed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [providers, setProviders] = useState<Record<ProviderId, ProviderState>>(
    () => {
      const initial = {} as Record<ProviderId, ProviderState>;
      PROVIDER_META.forEach((p) => {
        initial[p.id] = DEFAULT_PROVIDER_STATE(p.models);
      });
      return initial;
    }
  );

  // Load konfigurasi dari Supabase saat halaman pertama dibuka
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*');
      if (error || !data || cancelled) {
        setLoading(false);
        return;
      }
      setProviders((prev) => {
        const next = { ...prev };
        data.forEach((row) => {
          const id = row.provider as ProviderId;
          if (!next[id]) return;
          next[id] = {
            ...next[id],
            apiKey: row.api_key || '',
            model: row.model || next[id].model,
            temperature: Number(row.temperature) || next[id].temperature,
            maxTokens: Number(row.max_tokens) || next[id].maxTokens,
            topP: Number(row.top_p) || next[id].topP,
            expiresAt: row.expires_at || '',
            expiryAutoFilled: Boolean(row.expiry_auto_filled),
            savedAt: row.saved_at
              ? new Date(row.saved_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
              : null,
          };
        });
        return next;
      });
      const activeRow = data.find((r) => r.is_active && !isExpired(r.expires_at || ''));
      if (activeRow) setActiveProvider(activeRow.provider as ProviderId);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (type: ToastMessage['type'], text: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, text }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const activeExpired =
    activeProvider !== null && isExpired(providers[activeProvider].expiresAt);
  const isDemoMode = activeProvider === null || activeExpired;

  const activeDaysLeft =
    activeProvider !== null
      ? daysUntilExpiry(providers[activeProvider].expiresAt)
      : null;
  const isInGraceWindow =
    !isDemoMode &&
    activeDaysLeft !== null &&
    activeDaysLeft >= 0 &&
    activeDaysLeft <= GRACE_PERIOD_DAYS;

  const handleActivate = (id: ProviderId) => {
    setActiveProvider((prev) => (prev === id ? null : id));
  };

  // Simpan status aktif ke Supabase: nonaktifkan semua, lalu aktifkan yang dipilih
  const persistActive = async (id: ProviderId | null) => {
    await supabase.from('ai_providers').update({ is_active: false }).neq('provider', '');
    if (id) await supabase.from('ai_providers').update({ is_active: true }).eq('provider', id);
  };

  const handleChange = (id: ProviderId, patch: Partial<ProviderState>) => {
    setProviders((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const handleTest = async (id: ProviderId) => {
    const meta = PROVIDER_META.find((p) => p.id === id)!;
    const state = providers[id];

    if (state.apiKey.trim().length === 0) {
      handleChange(id, { testStatus: 'error' });
      pushToast('error', `API Key ${meta.name} kosong. Isi dulu.`);
      return;
    }

    handleChange(id, { testStatus: 'testing' });

    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor-chat', {
        body: { messages: [{ role: 'user', content: 'Test' }] },
      });

      if (error) {
        handleChange(id, { testStatus: 'error' });
        pushToast('error', `Koneksi ke ${meta.name} gagal: ${error.message}`);
        return;
      }

      if (data?.error) {
        handleChange(id, { testStatus: 'error' });
        pushToast('error', `Koneksi ke ${meta.name} gagal: ${data.error}`);
        return;
      }

      const patch: Partial<ProviderState> = {
        testStatus: 'success',
        expiresAt: addDaysIso(AUTO_EXPIRY_DAYS),
        expiryAutoFilled: true,
      };
      handleChange(id, patch);
      pushToast('success', `Koneksi ke ${meta.name} berhasil.`);
    } catch (err) {
      handleChange(id, { testStatus: 'error' });
      const msg = err instanceof Error ? err.message : 'Gagal menghubungi server.';
      pushToast('error', `Koneksi ke ${meta.name} gagal: ${msg}`);
    }
  };

  const handleSave = async (id: ProviderId) => {
    const meta = PROVIDER_META.find((p) => p.id === id)!;
    const state = providers[id];
    const isThisActive = activeProvider === id;

    if (isThisActive && state.apiKey.trim().length === 0) {
      pushToast(
        'error',
        `Tidak dapat menyimpan. API Key ${meta.name} kosong padahal provider ini aktif.`
      );
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('ai_providers')
      .update({
        api_key: state.apiKey,
        model: state.model,
        temperature: state.temperature,
        max_tokens: state.maxTokens,
        top_p: state.topP,
        expires_at: state.expiresAt || null,
        expiry_auto_filled: state.expiryAutoFilled,
        saved_at: now,
        updated_at: now,
      })
      .eq('provider', id);

    setSaving(false);
    if (error) {
      pushToast('error', `Gagal menyimpan ${meta.name}: ${error.message}`);
      return;
    }
    await persistActive(activeProvider);
    const nowDisplay = new Date(now).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    handleChange(id, { savedAt: nowDisplay });
    pushToast('success', `Pengaturan ${meta.name} berhasil disimpan.`);
  };

  return (
    <div className="w-full">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Connector
            </h1>
          </div>
          <p className="text-sm text-slate-500 max-w-xl">
            Pilih satu AI yang akan digunakan sebagai AI Tutor dan Teman AI.
            Hanya satu provider yang bisa aktif.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <>
            {isDemoMode && !modeDemoDismissed && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Sistem berjalan dalam mode demo
              </p>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                {activeExpired
                  ? 'Provider yang dipilih sudah melewati masa aktif. AI Tutor dan Teman AI menggunakan respons contoh statis sampai provider diperpanjang atau diganti.'
                  : 'Belum ada provider AI yang aktif. AI Tutor dan Teman AI menggunakan respons contoh statis sampai satu provider diaktifkan.'}
              </p>
            </div>
            <button
              onClick={() => setModeDemoDismissed(true)}
              className="text-amber-600 hover:text-amber-800 shrink-0"
              aria-label="Tutup peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isInGraceWindow && activeProvider !== null && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Masa tenggang: {activeDaysLeft === 0 ? 'habis hari ini' : `${activeDaysLeft} hari lagi habis`}
              </p>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                Masa aktif{' '}
                {PROVIDER_META.find((p) => p.id === activeProvider)?.name}{' '}
                akan berakhir pada{' '}
                {formatIndoDate(providers[activeProvider].expiresAt)}. Segera
                perpanjang API Key agar AI Tutor dan Teman AI tidak berhenti
                melayani Siswa dan Guru.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
          <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
          <p className="text-xs text-sky-800 leading-relaxed">
            Mengaktifkan satu provider akan otomatis menonaktifkan provider
            lain. Daftar model muncul setelah API Key diisi.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Pilihan provider AI"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {PROVIDER_META.map((meta) => (
            <ProviderCard
              key={meta.id}
              meta={meta}
              state={providers[meta.id]}
              isActive={activeProvider === meta.id}
              onActivate={() => handleActivate(meta.id)}
              onChange={(patch) => handleChange(meta.id, patch)}
              onTest={() => handleTest(meta.id)}
              onSave={() => handleSave(meta.id)}
              saving={saving}
            />
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Pengaturan tersimpan permanen di database Supabase.
          <br />
          Masa aktif ditetapkan otomatis oleh sistem saat AI terhubung dengan
          MIRAI — tidak dapat diubah manual.
        </p>
          </>
        )}
      </div>
    </div>
  );
}
