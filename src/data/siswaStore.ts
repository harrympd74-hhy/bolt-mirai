export interface SiswaRecord { kodeSiswa:string; createdAt:string; namaLengkap:string; nis:string; nisn:string; nik:string; tempatLahir:string; tanggalLahir:string; jenisKelamin:string; agama:string; telepon:string; email:string; alamat:string; kota:string; provinsi:string; kelas:string; tahunMasuk:string; namaWali:string; hubunganWali:string; teleponWali:string; status:string; }
export const kelasOptions=["VII A","VII B","VIII A","VIII B","IX A","IX B"];
export const statusOptions=["Aktif","Lulus","Pindah","Keluar"];
export const hubunganWaliOptions=["Ayah","Ibu","Wali Lainnya"];
export const statusBadgeColor:Record<string,string>={Aktif:"bg-[hsl(var(--guru-turquoise-soft))] text-[hsl(var(--guru-turquoise))]",Lulus:"bg-[hsl(var(--guru-sapphire-soft))] text-[hsl(var(--guru-sapphire))]",Pindah:"bg-[hsl(var(--guru-yellow-soft))] text-[hsl(var(--guru-brown))]",Keluar:"bg-muted text-muted-foreground"};
const base={namaLengkap:"",nis:"",nisn:"",nik:"",tempatLahir:"",tanggalLahir:"",jenisKelamin:"",agama:"",telepon:"",email:"",alamat:"",kota:"",provinsi:"",kelas:"",tahunMasuk:"",namaWali:"",hubunganWali:"",teleponWali:"",status:"Aktif"};
const seed=(kodeSiswa:string,namaLengkap:string,kelas:string):SiswaRecord=>({...base,kodeSiswa,namaLengkap,kelas,createdAt:"2024-07-15"});
let records:SiswaRecord[]=[seed("S-001","Ahmad Rizki","VII A"),seed("S-002","Siti Aisyah","VII A"),seed("S-003","Bima Pratama","VII B"),seed("S-004","Citra Lestari","VIII A"),seed("S-005","Dimas Saputra","IX B")];
export const getSiswaList=()=>records;
export const saveSiswaRecord=(record:SiswaRecord)=>{records=records.map(r=>r.kodeSiswa===record.kodeSiswa?record:r)};
export const deleteSiswaRecord=(kode:string)=>{records=records.filter(r=>r.kodeSiswa!==kode)};
export const addSiswaRecord=(record:SiswaRecord)=>{records=[...records,record]};
export const nextKodeSiswa=()=>`S-${String(Math.max(0,...records.map(r=>Number(r.kodeSiswa.slice(2))))+1).padStart(3,"0")}`;
