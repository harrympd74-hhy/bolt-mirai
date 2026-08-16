import { useCallback, useState } from "react";
import { Check, KeyRound, RotateCcw, Save } from "lucide-react";
import { addGuruRecord, jenisLabel, nextKodeGuru, type GuruRecord, type JenisGuru } from "@/data/guruStore";
import { FieldInput } from "./FieldInput";

type FormState = Omit<GuruRecord, "kodeGuru" | "createdAt">;

const initialForm: FormState = {
  jenisGuru: "tetap", namaLengkap: "", nip: "", nik: "", nuptk: "", tempatLahir: "", tanggalLahir: "",
  jenisKelamin: "", agama: "", statusPernikahan: "", telepon: "", email: "", alamat: "", kota: "", provinsi: "",
  golongan: "", tmt: "", unitKerja: "MIRAI", jabatan: "Guru Mata Pelajaran", mataPelajaran: "", kelasAmpu: "",
  bebanMengajar: "", pendidikanTerakhir: "", jurusan: "", universitas: "", statusSertifikasi: "Belum Sertifikasi",
};

export default function InputGuru({ onSaved }: { onSaved: (jenis: JenisGuru) => void }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [savedKode, setSavedKode] = useState<string | null>(null);
  const [savedJenis, setSavedJenis] = useState<JenisGuru>("tetap");
  const set = useCallback((key: string, value: string) => setForm((previous) => ({ ...previous, [key]: value })), []);

  const handleSave = () => {
    if (!form.namaLengkap.trim()) { setError("Nama lengkap wajib diisi."); return; }
    setError("");
    const kodeGuru = nextKodeGuru(form.jenisGuru);
    addGuruRecord({ ...form, kodeGuru, createdAt: new Date().toISOString() });
    setSavedKode(kodeGuru);
    setSavedJenis(form.jenisGuru);
  };

  const reset = () => { setForm(initialForm); setError(""); setSavedKode(null); };

  if (savedKode) return <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Check className="h-7 w-7 text-primary" /></div><h3 className="text-lg font-bold">Guru berhasil didaftarkan</h3><p className="mt-1 text-sm text-muted-foreground">Data telah masuk ke daftar {jenisLabel[savedJenis]}.</p><div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5"><KeyRound className="h-3 w-3 text-primary" /><span className="text-xs font-bold tracking-wider text-primary">{savedKode}</span></div><div className="mt-6 flex justify-center gap-2"><button onClick={reset} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Tambah Guru Lagi</button><button onClick={() => { setSavedKode(null); setForm(initialForm); onSaved(savedJenis); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Lihat Data Guru</button></div></div>;

  return <div className="mx-auto max-w-4xl space-y-5">
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h3 className="font-bold text-foreground">Input Guru Baru</h3><p className="mt-0.5 text-sm text-muted-foreground">Isi data guru di bawah ini. Data akan langsung masuk ke halaman Data Guru.</p></section>
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Jenis Kepegawaian</p><div className="grid grid-cols-3 gap-2">{(Object.keys(jenisLabel) as JenisGuru[]).map((jenis) => <button key={jenis} type="button" onClick={() => set("jenisGuru", jenis)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${form.jenisGuru === jenis ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-muted/50 text-foreground hover:bg-muted"}`}>{jenisLabel[jenis]}</button>)}</div></section>
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Pribadi</p><div className="grid gap-3 sm:grid-cols-2"><FieldInput label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={set} /><FieldInput label="NIP" name="nip" value={form.nip} onChange={set} /><FieldInput label="NIK" name="nik" value={form.nik} onChange={set} /><FieldInput label="NUPTK" name="nuptk" value={form.nuptk} onChange={set} /><FieldInput label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={set} /><FieldInput label="Tanggal Lahir" name="tanggalLahir" value={form.tanggalLahir} onChange={set} type="date" /><FieldInput label="Jenis Kelamin" name="jenisKelamin" value={form.jenisKelamin} onChange={set} /><FieldInput label="Agama" name="agama" value={form.agama} onChange={set} /><FieldInput label="Status Pernikahan" name="statusPernikahan" value={form.statusPernikahan} onChange={set} /><FieldInput label="No. Telepon" name="telepon" value={form.telepon} onChange={set} type="tel" /><FieldInput label="Email" name="email" value={form.email} onChange={set} type="email" /><div className="sm:col-span-2"><label className="block text-xs font-medium text-muted-foreground">Alamat<textarea value={form.alamat} onChange={(event) => set("alamat", event.target.value)} rows={2} placeholder="Alamat" className="mt-1 w-full resize-none rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" /></label></div><FieldInput label="Kota/Kabupaten" name="kota" value={form.kota} onChange={set} /><FieldInput label="Provinsi" name="provinsi" value={form.provinsi} onChange={set} /></div></section>
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Kepegawaian</p><div className="grid gap-3 sm:grid-cols-2"><FieldInput label="Golongan/Ruang" name="golongan" value={form.golongan} onChange={set} /><FieldInput label="TMT" name="tmt" value={form.tmt} onChange={set} type="date" /><FieldInput label="Unit Kerja" name="unitKerja" value={form.unitKerja} onChange={set} /><FieldInput label="Jabatan" name="jabatan" value={form.jabatan} onChange={set} /><FieldInput label="Mata Pelajaran" name="mataPelajaran" value={form.mataPelajaran} onChange={set} /><FieldInput label="Kelas Diampu" name="kelasAmpu" value={form.kelasAmpu} onChange={set} /><FieldInput label="Beban Mengajar" name="bebanMengajar" value={form.bebanMengajar} onChange={set} /><FieldInput label="Pendidikan Terakhir" name="pendidikanTerakhir" value={form.pendidikanTerakhir} onChange={set} /><FieldInput label="Jurusan/Prodi" name="jurusan" value={form.jurusan} onChange={set} /><FieldInput label="Universitas" name="universitas" value={form.universitas} onChange={set} /><FieldInput label="Status Sertifikasi" name="statusSertifikasi" value={form.statusSertifikasi} onChange={set} /></div></section>
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div>{error ? <p className="text-sm font-medium text-destructive">{error}</p> : <span className="text-xs text-muted-foreground">Kode guru dibuat otomatis sesuai jenis kepegawaian.</span>}</div><div className="flex justify-end gap-2"><button onClick={reset} className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted"><RotateCcw className="h-3.5 w-3.5" /> Reset</button><button onClick={handleSave} className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"><Save className="h-4 w-4" /> Simpan Guru</button></div></section>
  </div>;
}
