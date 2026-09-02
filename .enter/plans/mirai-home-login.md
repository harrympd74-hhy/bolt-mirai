# Rencana: Tema Dasbor Siswa seperti Referensi MIRAI

## Context
Dasbor siswa perlu mengikuti referensi visual baru: sidebar biru dengan identitas siswa, header putih, banner sambutan biru, empat kartu statistik berwarna, aktivitas terbaru, dan akses cepat. Data dan interaksi yang ada tetap dipakai, tetapi komposisi Beranda disederhanakan mengikuti pola dashboard referensi.

## Pendekatan
1. Refactor `SiswaDashboard` menjadi shell dashboard dengan sidebar biru, header/topbar putih, dan layout responsif.
2. Tambahkan menu sidebar: Dashboard/Beranda, Ruang Kelas, Pertemuan Saya, Jendela Ilmu, Ruang Kolaborasi, AI Tutor, Jadwal Saya, Pengaturan, dan Keluar.
3. Tambahkan banner sambutan siswa dengan identitas kelas/semester.
4. Tambahkan empat kartu statistik berwarna: Mata Pelajaran, Tugas Aktif, Rata-rata Nilai, dan Kehadiran. Gunakan data siswa yang ada dan tidak menampilkan Card Struggle/Streak/Daya Juang/Total Poin.
5. Buat panel Aktivitas Terbaru dan Akses Cepat dengan CTA terhubung ke navigasi yang sudah ada.
6. Pertahankan komponen jadwal/pertemuan dan ruang kelas sebagai halaman internal sidebar.

## File yang dibuat/diubah
- `src/pages/SiswaDashboard.tsx`: shell dashboard dan beranda referensi.
- `src/data/siswaDashboardData.ts`: statistik, aktivitas, dan label dashboard bila diperlukan.
- `src/components/student/StudentSidebar.tsx`: sidebar reusable bila diperlukan.
- `src/components/student/StudentTopbar.tsx`: topbar reusable bila diperlukan.

## Implementation checklist
- [ ] Buat sidebar biru responsif dengan menu dan highlight aktif.
- [ ] Buat header putih dengan pencarian, tema, notifikasi, dan keluar.
- [ ] Buat banner sambutan siswa biru.
- [ ] Buat empat kartu statistik berwarna sesuai referensi.
- [ ] Buat panel Aktivitas Terbaru.
- [ ] Buat panel Akses Cepat dengan CTA berfungsi.
- [ ] Pastikan halaman Ruang Kelas/Pertemuan/Jendela Ilmu tetap bisa dibuka dari sidebar.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Tampilan desktop mengikuti struktur referensi: sidebar, topbar, banner, statistik, aktivitas, akses cepat.
- [ ] Tampilan mobile dapat membuka/menutup sidebar.
- [ ] Data nama siswa, kelas, tugas, nilai, dan kehadiran tampil konsisten.
- [ ] Tidak ada Card Problem Struggle, Streak, Daya Juang, atau Total Poin di Beranda.
- [ ] CTA sidebar dan akses cepat mengubah halaman aktif dengan benar.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
