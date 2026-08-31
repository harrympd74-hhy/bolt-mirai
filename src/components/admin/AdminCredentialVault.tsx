import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound, Pencil, Plus, Search, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AccountType = "student" | "parent" | "teacher" | "guest";
type Credential = { id: string; account_type: AccountType; subject_key: string; display_name: string; username: string; metadata?: Record<string, unknown> };
const labels: Record<AccountType, string> = { student: "Siswa", parent: "Ortu", teacher: "Guru", guest: "Tamu" };

export default function AdminCredentialVault() {
  const [items, setItems] = useState<Credential[]>([]);
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Credential | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setBusy(true); setError("");
    const { data, error: invokeError } = await supabase.functions.invoke("admin-credential-vault", { body: { action: "list" } });
    if (invokeError) setError("Gagal memuat akun. Pastikan sesi admin MIRAI aktif.");
    else setItems(data?.credentials || []);
    setBusy(false);
  };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => items.filter((item) => `${item.display_name} ${item.username} ${item.subject_key} ${labels[item.account_type]}`.toLowerCase().includes(query.toLowerCase())), [items, query]);

  const toggleReveal = async (item: Credential) => {
    if (revealed[item.id]) { setRevealed((current) => { const next = { ...current }; delete next[item.id]; return next; }); return; }
    const { data, error: invokeError } = await supabase.functions.invoke("admin-credential-vault", { body: { action: "reveal", id: item.id } });
    if (invokeError || !data?.password) { setError("Password tidak dapat ditampilkan."); return; }
    setRevealed((current) => ({ ...current, [item.id]: data.password }));
  };

  const save = async (payload: { accountType: AccountType; subjectKey: string; displayName: string; username: string; password: string }) => {
    setBusy(true); setError(""); setMessage("");
    const { error: invokeError } = await supabase.functions.invoke("admin-credential-vault", { body: { action: "upsert", ...payload, id: editing?.id } });
    if (invokeError) setError("Perubahan gagal disimpan. Password minimal 8 karakter.");
    else { setEditing(undefined); setMessage("Perubahan akun berhasil disimpan."); await load(); }
    setBusy(false);
  };

  return <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[hsl(var(--guru-turquoise))]" /><h3 className="text-lg font-bold">Akun & Password MIRAI</h3></div><p className="mt-1 text-sm text-muted-foreground">Hanya admin MIRAI yang dapat melihat atau mengubah password.</p></div><button type="button" onClick={() => setEditing(null)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"><Plus size={15} /> Tambah Akun</button></div>
    <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, username, atau identitas..." className="w-full rounded-xl border border-input bg-muted/30 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary" /></div>
    {message && <p className="rounded-xl bg-[hsl(var(--guru-turquoise-soft))] px-3 py-2 text-sm text-foreground">{message}</p>}{error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    <div className="overflow-x-auto rounded-xl border border-border"><table className="min-w-[820px] w-full text-sm"><thead><tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">{["Jenis", "Nama", "Identitas", "Username", "Password", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.id} className="hover:bg-muted/30"><td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{labels[item.account_type]}</span></td><td className="px-4 py-3 font-semibold">{item.display_name}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.subject_key}</td><td className="px-4 py-3 font-mono text-xs">{item.username}</td><td className="px-4 py-3 font-mono text-xs">{revealed[item.id] || "••••••••"}</td><td className="px-4 py-3"><div className="flex gap-1"><button type="button" aria-label={revealed[item.id] ? "Sembunyikan password" : "Lihat password"} onClick={() => void toggleReveal(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{revealed[item.id] ? <EyeOff size={15} /> : <Eye size={15} />}</button><button type="button" aria-label="Edit akun" onClick={() => setEditing(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={15} /></button></div></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">{busy ? "Memuat akun..." : "Belum ada akun di vault."}</td></tr>}</tbody></table></div>
    {editing !== undefined && <CredentialForm initial={editing} onClose={() => setEditing(undefined)} onSave={save} busy={busy} />}
  </div>;
}

function CredentialForm({ initial, onClose, onSave, busy }: { initial: Credential | null; onClose: () => void; onSave: (payload: { accountType: AccountType; subjectKey: string; displayName: string; username: string; password: string }) => Promise<void>; busy: boolean }) {
  const [accountType, setAccountType] = useState<AccountType>(initial?.account_type || "student"); const [subjectKey, setSubjectKey] = useState(initial?.subject_key || ""); const [displayName, setDisplayName] = useState(initial?.display_name || ""); const [username, setUsername] = useState(initial?.username || ""); const [password, setPassword] = useState(""); const [visible, setVisible] = useState(false);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"><div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl"><div className="flex items-center justify-between"><div><h3 className="font-bold">{initial ? "Edit Akun MIRAI" : "Tambah Akun MIRAI"}</h3><p className="mt-1 text-xs text-muted-foreground">Password disimpan terenkripsi dan tidak masuk ke browser.</p></div><button type="button" aria-label="Tutup" onClick={onClose}><X size={18} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">Jenis akun<select value={accountType} disabled={!!initial} onChange={(event) => setAccountType(event.target.value as AccountType)} className="mt-1 w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 text-sm"><option value="student">Siswa</option><option value="parent">Ortu</option><option value="teacher">Guru</option><option value="guest">Tamu</option></select></label><label className="text-xs font-semibold">Identitas / kode<input value={subjectKey} onChange={(event) => setSubjectKey(event.target.value)} className="mt-1 w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 text-sm" /></label><label className="text-xs font-semibold sm:col-span-2">Nama lengkap<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1 w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 text-sm" /></label><label className="text-xs font-semibold">Username<input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 text-sm" /></label><label className="text-xs font-semibold">Password<input type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={initial ? "Masukkan password baru" : "Minimal 8 karakter"} className="mt-1 w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 pr-10 text-sm" /><button type="button" onClick={() => setVisible((value) => !value)} className="relative -mt-8 mr-2 flex justify-self-end text-muted-foreground">{visible ? <EyeOff size={15} /> : <Eye size={15} />}</button></label></div><button type="button" disabled={busy || password.length < 8} onClick={() => void onSave({ accountType, subjectKey, displayName, username, password })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><KeyRound size={16} />{busy ? "Menyimpan..." : "Simpan Perubahan"}</button></div></div>;
}
