import type { FormEvent } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLoginModal from "../components/AdminLoginModal";

const team = [
  { name: "Prof. Dr.H. Tatang Herman, M.Ed.", role: "Promotor", image: "https://cdn.enter.pro/resources/uid_100054821/28afbca4-8ad2-4d.png" },
  { name: "Prof. Dr. H. Sufyani Prabawanto, M.Ed.", role: "Ko-Promotor 1", image: "https://cdn.enter.pro/resources/uid_100054821/3eeb0c02-89cc-40.png" },
  { name: "Prof. Al Jupri, S.Pd., M.Sc., Ph.D.", role: "Ko-Promotor 2", image: "https://cdn.enter.pro/resources/uid_100054821/3d6251a9-2096-41.png" },
  { name: "Yuni Suryaningsih", role: "Peneliti", image: "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/e6b0c657-762d-49.png" },
];

const roles = [
  { title: "Guru", desc: "Kelola pembelajaran & administrasi kelas", key: "guru", image: "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/798ab757-3198-4d.png", from: "#10b981", to: "#0d9488" },
  { title: "Siswa", desc: "Belajar dengan AI Tutor & pantau progres", key: "siswa", image: "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/efd9f1e7-bf3f-49.png", from: "#3b82f6", to: "#06b6d4" },
  { title: "Orang Tua", desc: "Pantau perkembangan anak secara realtime", key: "ortu", image: "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/340e34d8-5045-4b.png", from: "#8b5cf6", to: "#7c3aed" },
  { title: "Tamu", desc: "Akses informasi & laporan sekolah", key: "tamu", image: "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/f026320c-1d02-4c.png", from: "#f59e0b", to: "#d97706" },
] as const;

type Role = (typeof roles)[number];

function LoginModal({ role, onClose }: { role: Role; onClose: () => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    if (username !== "hasanhadid" || password !== "hasanhadid68") {
      setError("Username atau kata sandi salah.");
      setLoading(false);
      return;
    }
    setLoading(false);
    if (role.key === "guru") navigate("/guru");
    else if (role.key === "siswa") navigate("/siswa");
    else {
      window.alert(`Selamat datang, ${role.title}!`);
      onClose();
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-2xl" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${role.from}, ${role.to})` }} />
        <div className="flex items-center gap-4 px-6 py-5">
          <img src={role.image} alt={role.title} className="h-14 w-14 rounded-full object-cover ring-2 ring-border" crossOrigin="anonymous" />
          <div className="flex-1"><p className="text-xs text-muted-foreground">Masuk sebagai</p><h2 className="text-xl font-bold text-card-foreground">{role.title}</h2></div>
          <button type="button" aria-label="Tutup login" onClick={onClose} className="rounded-full bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-5 border-t border-border px-6 py-6">
          <label className="block text-sm font-medium text-foreground">Username<input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username / NISN / NIP" className="mt-2 w-full rounded-2xl border border-input bg-muted/50 px-5 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" /></label>
          <label className="block text-sm font-medium text-foreground">Kata Sandi<div className="relative mt-2"><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan kata sandi" className="w-full rounded-2xl border border-input bg-muted/50 px-5 py-3.5 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" /><button type="button" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          {error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-primary-foreground shadow-lg transition hover:brightness-105 disabled:opacity-70" style={{ background: `linear-gradient(135deg, ${role.from}, ${role.to})` }}>{loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />}{loading ? "Memverifikasi..." : "Masuk ke Sistem"}</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  return <main className="mirai-page relative min-h-screen overflow-hidden font-sans text-foreground">
    <div className="mirai-background" aria-hidden="true"><div className="mirai-grid" /><div className="mirai-orb mirai-orb-one" /><div className="mirai-orb mirai-orb-two" /><div className="mirai-orb mirai-orb-three" /><div className="mirai-ring mirai-ring-one" /><div className="mirai-ring mirai-ring-two" />{["12%", "55%", "80%", "8%", "65%", "90%"].map((left, index) => <motion.span key={left} className="mirai-dot" style={{ left, top: `${15 + index * 13}%` }} animate={{ y: [0, -10, 0], opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 3 + index * 0.5, repeat: Infinity, delay: index * 0.3 }} />)}</div>
    <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[42%_58%]">
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:py-16"><div className="w-full max-w-2xl text-center"><motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} src="https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100050201/03d27ec3-8a8f-4d.png" alt="Logo Sekolah" className="mx-auto mb-6 h-24 w-24 rounded-full bg-card object-contain p-2 shadow-xl ring-4 ring-card/70" crossOrigin="anonymous" /><motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}><div className="flex items-center justify-center gap-3"><span className="text-right text-xs font-bold leading-snug tracking-[0.18em] text-muted-foreground">SELAMAT<br />DATANG DI</span><span className="mirai-title">MIRAI</span></div><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ekosistem pembelajaran digital cerdas</p></motion.div><motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Tim riset</p><div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-6">{team.map((person, index) => <div key={person.name} className={`flex w-36 flex-col items-center gap-2 ${index === 3 ? "basis-full" : ""}`}><img src={person.image} alt={person.name} className={`h-32 w-32 object-contain ${index === 3 ? "rounded-full object-cover ring-4 ring-card shadow-lg" : ""}`} crossOrigin="anonymous" /><p className="w-36 text-center text-[10px] font-semibold leading-tight text-foreground">{person.name}</p><p className="text-[10px] text-muted-foreground">{person.role}</p></div>)}</div></motion.div></div></section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:py-16"><div className="w-full max-w-xl"><p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Pilih peran anda</p><div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-10">{roles.map((role, index) => <motion.button key={role.key} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedRole(role)} className="group flex flex-col items-center gap-3 rounded-3xl p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary"><motion.span animate={{ y: [0, -9, 0] }} transition={{ duration: 3 + index * 0.4, repeat: Infinity, delay: index * 0.25 }} className="relative block h-32 w-32 rounded-full p-[3px] shadow-lg transition-transform group-hover:scale-105 sm:h-40 sm:w-40" style={{ background: `linear-gradient(135deg, ${role.from}, ${role.to})`, boxShadow: `0 10px 30px ${role.from}44` }}><img src={role.image} alt="" className="h-full w-full rounded-full bg-card object-cover ring-4 ring-card/70" crossOrigin="anonymous" /></motion.span><span className="text-base font-bold text-foreground">{role.title}</span><span className="max-w-44 text-xs leading-relaxed text-muted-foreground">{role.desc}</span></motion.button>)}</div></div></section>
    </div>
    <button type="button" aria-label="Login Admin" title="Login Admin" onClick={() => setAdminOpen(true)} className="fixed bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/85 text-slate-50 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><LockKeyhole className="h-5 w-5" /></button>
    <AnimatePresence>{selectedRole && <LoginModal role={selectedRole} onClose={() => setSelectedRole(null)} />}</AnimatePresence><AdminLoginModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
  </main>;
}
