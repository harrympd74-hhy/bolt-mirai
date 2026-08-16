export type JenisGuru = "tetap" | "honor" | "magang";
export interface GuruRecord { kodeGuru:string; jenisGuru:JenisGuru; createdAt:string; namaLengkap:string; nip:string; nik:string; nuptk:string; tempatLahir:string; tanggalLahir:string; jenisKelamin:string; agama:string; statusPernikahan:string; telepon:string; email:string; alamat:string; kota:string; provinsi:string; golongan:string; tmt:string; unitKerja:string; jabatan:string; mataPelajaran:string; kelasAmpu:string; bebanMengajar:string; pendidikanTerakhir:string; jurusan:string; universitas:string; statusSertifikasi:string; }
export const jenisLabel:Record<JenisGuru,string>={tetap:"Guru Tetap",honor:"Guru Honor",magang:"Guru Magang"};
export const jenisBadgeColor:Record<JenisGuru,string>={tetap:"bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]",honor:"bg-[hsl(var(--guru-yellow-soft))] text-[hsl(var(--guru-brown))]",magang:"bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]"};
const base={namaLengkap:"",nip:"",nik:"",nuptk:"",tempatLahir:"",tanggalLahir:"",jenisKelamin:"",agama:"",statusPernikahan:"",telepon:"",email:"",alamat:"",kota:"",provinsi:"",golongan:"",tmt:"",unitKerja:"MIRAI",jabatan:"Guru Mata Pelajaran",mataPelajaran:"",kelasAmpu:"",bebanMengajar:"",pendidikanTerakhir:"",jurusan:"",universitas:"",statusSertifikasi:"Belum Sertifikasi"};
const seed=(kodeGuru:string,jenisGuru:JenisGuru,namaLengkap:string,mataPelajaran:string):GuruRecord=>({...base,kodeGuru,jenisGuru,namaLengkap,mataPelajaran,createdAt:"2025-01-15"});
let records:GuruRecord[]=[seed("G-001","tetap","Ahmad Fauzi, S.Pd., M.Pd.","Matematika"),seed("G-002","tetap","Siti Rahma, S.Pd.","Bahasa Indonesia"),seed("G-011","honor","Rina Kartika, S.S.","Bahasa Inggris"),seed("G-021","magang","Nadia Putri","Informatika")];
export const getGuruByJenis=(jenis:JenisGuru)=>records.filter(r=>r.jenisGuru===jenis);
export const saveGuruRecord=(record:GuruRecord)=>{records=records.map(r=>r.kodeGuru===record.kodeGuru?record:r)};
export const deleteGuruRecord=(kode:string)=>{records=records.filter(r=>r.kodeGuru!==kode)};
export const addGuruRecord=(record:GuruRecord)=>{records=[...records,record]};
export const countGuruByJenis=(jenis:JenisGuru)=>getGuruByJenis(jenis).length;
export const nextKodeGuru=(jenis:JenisGuru)=>{const prefix=jenis==="tetap"?"G-0":jenis==="honor"?"G-01":"G-02";const nums=records.filter(r=>r.jenisGuru===jenis).map(r=>Number(r.kodeGuru.slice(prefix.length))).filter(Number.isFinite);return `${prefix}${String((nums.length?Math.max(...nums):0)+1).padStart(2,"0")}`};
