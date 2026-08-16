# Rencana Implementasi Dashboard Siswa SMP Kelas 7

## Context
Pengguna memberikan rancangan dashboard siswa MIRAI, tetapi data contoh masih menggunakan Kelas 8C, Persamaan Kuadrat, dan materi kelas lain. Scope telah dikoreksi menjadi SMP kelas 7 dengan fokus kegiatan Matematika: **bangun ruang segitiga** dan **jenis-jenis garis**. Proyek saat ini belum memiliki halaman/komponen dashboard siswa yang dirujuk, sehingga implementasi akan dibuat terintegrasi sebagai route baru tanpa mengubah dashboard admin maupun guru.

## Pendekatan yang direkomendasikan
- Menambahkan route `/siswa` yang merender dashboard siswa mandiri dengan state frontend lokal.
- Mengadaptasi struktur visual kode yang diberikan: sidebar portal siswa, kartu profil, navigasi aktif, statistik belajar, jadwal, tugas, ruang kelas, dan placeholder menu.
- Mengganti seluruh identitas menjadi siswa SMP kelas 7; menghindari Kelas 8/9, persamaan kuadrat, serta materi non-kelas-7.
- Menggunakan aktivitas utama Matematika kelas 7: pengenalan bangun ruang berbasis segitiga, luas/volume/prisma segitiga, serta jenis garis (sejajar, berpotongan, tegak lurus, dan transversal).
- Membuat interaksi lokal untuk navigasi sidebar, submenu jadwal, membuka ruang kelas aktif, memilih tim belajar, dan membuka sesi tutor sebagai panel/halaman internal sederhana; tidak mengaktifkan AI backend atau API karena konfigurasi AI masih tahap pembangunan.
- Menggunakan token tema MIRAI yang tersedia dan komponen lucide/framer-motion yang sudah terpasang; tidak menambah dependency.
- Menambahkan responsive mobile layout agar sidebar berubah menjadi drawer dan konten tetap terbaca.

## File kritis yang akan dibuat/dimodifikasi
- `src/pages/SiswaDashboard.tsx`: shell dashboard, state navigasi, sidebar, dashboard beranda, ruang kelas, dan placeholder.
- `src/data/siswaDashboardData.ts`: data demo siswa kelas 7, jadwal, tugas, materi, statistik, dan kelompok belajar.
- `src/router.tsx`: route `/siswa` sebelum catch-all.
- `src/index.css`: token siswa tambahan bila diperlukan untuk warna aksen/orange/amber/emerald dan grid dekoratif.
- Komponen kecil di `src/components/siswa/` bila pemisahan diperlukan untuk menjaga dashboard tidak monolitik.

## Implementation checklist
- [ ] Tambahkan data demo siswa kelas VII-A dan konteks SMP kelas 7.
- [ ] Tambahkan jadwal hanya untuk pembelajaran Matematika kelas 7 dan aktivitas terkait bangun ruang segitiga/jenis garis.
- [ ] Tambahkan tugas aktif hanya untuk topik bangun ruang segitiga dan jenis-jenis garis.
- [ ] Tambahkan sidebar siswa dengan Beranda, Jadwal Pelajaran, Ruang Kelas, Jendela Ilmu, Meja Kerja, dan Papan Nama.
- [ ] Tambahkan statistik streak, daya juang, total poin, dan progres pembelajaran.
- [ ] Tambahkan kartu pelajaran yang sedang berlangsung dengan aksi masuk kelas.
- [ ] Tambahkan panel Jadwal Hari Ini dan Meja Kerja.
- [ ] Tambahkan akses cepat ke ruang kelas, materi, nilai, dan profil.
- [ ] Tambahkan halaman internal Ruang Kelas dengan materi/aktivitas dua topik fokus.
- [ ] Tambahkan halaman placeholder untuk menu siswa lain tanpa menampilkan konten kelas non-7.
- [ ] Tambahkan route `/siswa` dan pastikan route `/`, `/admin`, dan `/guru` tetap tidak berubah.
- [ ] Terapkan animasi masuk ringan, active state, dan responsive drawer tanpa overflow horizontal.

## Verification checklist
- [ ] Verifikasi `/siswa` dapat dirender tanpa import error.
- [ ] Verifikasi tidak ada teks Kelas 8C, Kelas 9, atau Persamaan Kuadrat pada dashboard siswa.
- [ ] Verifikasi topik bangun ruang segitiga dan jenis-jenis garis muncul pada jadwal, tugas, materi, dan ruang kelas.
- [ ] Verifikasi klik navigasi sidebar mengubah halaman aktif dan menu Jadwal memiliki submenu.
- [ ] Verifikasi aksi Masuk Kelas membuka ruang kelas aktif dan tombol keluar kembali ke beranda.
- [ ] Verifikasi kartu tugas menampilkan status selesai/belum dan jumlah tugas tertunda.
- [ ] Verifikasi sidebar mobile/drawer serta layout mobile tidak menyebabkan overflow.
- [ ] Verifikasi tombol keluar mengembalikan ke halaman home `/`.
- [ ] Jalankan lint dan build proyek melalui workflow framework setelah implementasi.
