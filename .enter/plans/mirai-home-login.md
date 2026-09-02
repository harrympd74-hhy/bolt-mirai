# Rencana: Data UjiBetaversiMIrai pada Dasbor Guru

## Context
Pengguna meminta submenu Kelas Saya dan seluruh submenu, serta Siswa dan seluruh submenu seperti Semua Siswa, Progress, Kelompok Belajar, dan lainnya, tidak lagi menampilkan placeholder. Semua halaman memakai data UjiBetaversiMIrai yang konsisten dan dapat mengarah ke konteks kelas/siswa yang sama dengan dasbor siswa.

## Pendekatan
1. Buat dataset guru bersama berisi kelas VII-A/VII-B/VII-C, daftar siswa, progres, kelompok, jadwal, dan aktivitas. Dataset hanya data uji non-rahasia.
2. Buat komponen reusable `TeacherClassWorkspace` untuk semua submenu Kelas Saya: daftar kelas, detail kelas, jadwal, pembuatan kelas uji, dan arsip.
3. Buat komponen reusable `TeacherStudentWorkspace` untuk semua submenu Siswa: Semua Siswa, Progress & Capaian, Kelompok Belajar, Productive Struggle, dan Tutor Sebaya.
4. Semua kartu siswa memiliki CTA yang membuka konteks kelas/ruang siswa yang sama; progres dan kelompok memakai IDs/kode siswa yang konsisten dengan dataset siswa.
5. Pertahankan backend sebagai jalur produksi ketika tersedia, tetapi fallback UjiBetaversiMIrai digunakan saat backend/Auth belum siap. Label UI menggunakan `UjiBetaversiMIrai`, bukan “Demo”.

## File yang dibuat/diubah
- `src/data/teacherBetaversionData.ts`: dataset kelas, siswa, progres, kelompok, jadwal, aktivitas.
- `src/components/guru/TeacherClassWorkspace.tsx`: halaman Kelas Saya dan subhalaman.
- `src/components/guru/TeacherStudentWorkspace.tsx`: halaman Siswa dan subhalaman.
- `src/pages/GuruDashboard.tsx`: routing berdasarkan active ke komponen baru.
- `src/components/guru/navConfig.ts`: label/submenu tetap konsisten.
- `src/pages/guru/Beranda.tsx`: CTA kelas/siswa mengarah ke workspace baru bila diperlukan.

## Batasan
- Data UjiBetaversiMIrai tidak dianggap data sekolah nyata.
- Tidak memasukkan password, token, atau secret ke dataset.
- Fitur backend/Auth tetap dapat menggantikan fallback setelah akun dan koneksi produksi tersedia.

## Implementation checklist
- [ ] Buat dataset UjiBetaversiMIrai kelas, siswa, progres, kelompok, dan jadwal.
- [ ] Buat workspace Kelas Saya dengan routing daftar/detail/jadwal/buat/arsip.
- [ ] Buat workspace Siswa dengan routing semua siswa/progress/kelompok/struggle/tutor sebaya.
- [ ] Tambahkan filter pencarian, kartu ringkasan, dan CTA konteks.
- [ ] Hubungkan klik siswa ke kelas yang sesuai dan identitas siswa yang sama dengan dasbor siswa.
- [ ] Ganti semua placeholder terkait submenu Kelas Saya dan Siswa.
- [ ] Jalankan pnpm run check dan pnpm run build.

## Verification checklist
- [ ] Semua submenu Kelas Saya membuka halaman berisi data UjiBetaversiMIrai.
- [ ] Semua submenu Siswa membuka halaman berisi data UjiBetaversiMIrai.
- [ ] Siswa, kelas, progres, kelompok, dan jadwal konsisten antar halaman.
- [ ] CTA dari guru mengarah ke konteks kelas/siswa yang benar.
- [ ] Tidak ada label “Demo” pada UI yang direvisi.
- [ ] Tidak ada password/token/secret dalam dataset.
- [ ] pnpm run check dan pnpm run build berhasil.
