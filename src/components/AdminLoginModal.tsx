import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-sm rounded-[2rem] bg-card p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Akses terbatas</p><h2 className="mt-1 text-xl font-bold text-card-foreground">Login Admin</h2></div><button type="button" aria-label="Tutup login admin" onClick={onClose} className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button></div>
        <form onSubmit={async (event) => { event.preventDefault(); setError(""); const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: `${username.trim().toLowerCase()}@mirai.local`, password }); if (loginError || data.user?.app_metadata?.role !== "admin") { await supabase.auth.signOut(); setError("Username atau kata sandi admin salah."); return; } onClose(); navigate("/admin"); }} className="space-y-4">
          <label className="block text-sm font-medium text-foreground">Username<input required value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} className="mt-2 w-full rounded-2xl border border-input bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" /></label>
          <label className="block text-sm font-medium text-foreground">Kata Sandi<div className="relative mt-2"><input required value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} type={showPassword ? "text" : "password"} className="w-full rounded-2xl border border-input bg-muted/50 px-4 py-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" /><button type="button" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90">Masuk sebagai Admin</button>
        </form>
      </div>
    </div>
  );
}
