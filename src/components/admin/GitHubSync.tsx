import { useState } from "react";
import { CheckCircle2, CloudDownload, GitBranch, Loader2, RefreshCw, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function GitHubSync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; commitSha?: string; filesProcessed?: number; recordsImported?: number } | null>(null);

  const sync = async () => {
    setLoading(true); setResult(null);
    const { data, error } = await supabase.functions.invoke("github-sync", { body: {} });
    setLoading(false);
    if (error) { setResult({ ok: false, message: error.message }); return; }
    if (data?.error) { setResult({ ok: false, message: data.error }); return; }
    setResult({ ok: true, message: "Sinkronisasi GitHub berhasil.", commitSha: data.commitSha, filesProcessed: data.filesProcessed, recordsImported: data.recordsImported });
  };

  return <section className="mx-auto max-w-4xl space-y-5"><div><h2 className="flex items-center gap-3 text-2xl font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]"><GitBranch className="h-5 w-5" /></span>Sinkronisasi GitHub</h2><p className="mt-1 text-sm text-muted-foreground">GitHub menjadi sumber utama data; Enter Cloud menyimpan salinan operasional untuk dasbor MIRAI.</p></div><div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-bold">bolt-mirai · branch main</p><p className="mt-1 text-xs text-muted-foreground">File yang dibaca: data/students.json, data/teachers.json, data/classes.json, data/schedules.json</p></div><button type="button" onClick={sync} disabled={loading} className="flex items-center gap-2 rounded-xl bg-[hsl(var(--guru-sapphire))] px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}{loading ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</button></div><div className="mt-5 rounded-xl border border-[hsl(var(--guru-yellow)/0.35)] bg-[hsl(var(--guru-yellow-soft)/0.45)] p-4 text-xs text-[hsl(var(--guru-brown))]"><p className="font-bold">Kontrak data</p><p className="mt-1">JSON mentah divalidasi dengan Zod sebelum masuk database. Password, token, dan API key tidak boleh berada di repository.</p></div>{result && <div className={`mt-5 rounded-xl border p-4 ${result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-destructive/20 bg-destructive/10 text-destructive"}`}>{result.ok ? <CheckCircle2 className="mb-2 h-5 w-5" /> : <XCircle className="mb-2 h-5 w-5" />}<p className="font-semibold">{result.message}</p>{result.ok && <div className="mt-2 grid gap-1 text-xs"><span>Commit: <b className="font-mono">{result.commitSha?.slice(0, 10)}</b></span><span>File diproses: <b>{result.filesProcessed}</b></span><span>Record diimpor: <b>{result.recordsImported}</b></span></div>}</div>}</div><p className="flex items-center gap-2 text-xs text-muted-foreground"><RefreshCw className="h-3.5 w-3.5" /> Sinkronisasi saat ini manual. Jadwal harian dapat diaktifkan setelah format JSON tervalidasi.</p></section>;
}
