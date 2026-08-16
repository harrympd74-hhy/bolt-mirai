# Rencana Adaptasi Ruang Kelas Aktif Siswa Kelas 7

## Context
Kode `RuangKelasAktif` yang diberikan masih memakai sinopsis dan kuis tentang kubus, balok, tabung, bola, serta rumus yang tidak sesuai fokus pembelajaran saat ini. Dashboard siswa harus konsisten untuk SMP kelas 7 dengan dua kegiatan: **Bangun Ruang Segitiga** dan **Jenis-Jenis Garis**.

## Pendekatan yang direkomendasikan
- Menambahkan `src/pages/siswa/RuangKelasAktif.tsx` versi kelas 7 dengan alur Presensi → Sinopsis → Kuis → Hasil.
- Menggunakan data materi dan soal baru yang hanya membahas prisma segitiga, luas alas/volume, garis sejajar, garis berpotongan, garis tegak lurus, dan garis transversal.
- Mempertahankan state jawaban, feedback per soal, penentuan tim Pengintai/Navigator, tampilan hasil, dan tombol mulai AI Tutor demo.
- Menghubungkan komponen ini dari `SiswaDashboard` ketika siswa memilih materi atau masuk Ruang Kelas; sesi AI Tutor yang sudah dibuat tetap digunakan untuk pendalaman topik.
- Tidak memakai komponen study group atau AI backend yang belum tersedia; hasil tim cukup ditampilkan sebagai state lokal yang stabil.

## File kritis
- `src/pages/siswa/RuangKelasAktif.tsx`: komponen kelas aktif baru.
- `src/pages/SiswaDashboard.tsx`: integrasi state kelas aktif, topik, dan callback tutor.
- `src/pages/siswa/AITutorSession.tsx`: dipanggil setelah hasil kuis sesuai topik.
- `src/data/siswaDashboardData.ts`: sumber identitas siswa dan konteks kelas VII-A.

## Implementation checklist
- [ ] Tambahkan tipe langkah `presensi`, `sinopsis`, `quiz`, dan `hasil`.
- [ ] Tambahkan sinopsis Bangun Ruang Segitiga dengan unsur, luas alas, luas permukaan, dan volume prisma segitiga.
- [ ] Tambahkan sinopsis Jenis-Jenis Garis dengan sejajar, berpotongan, tegak lurus, dan transversal.
- [ ] Tambahkan soal kuis kelas 7 dengan jawaban benar yang sesuai topik terpilih.
- [ ] Tambahkan feedback jawaban, progres kuis, dan penentuan tim berdasarkan skor.
- [ ] Tambahkan layar hasil dengan tombol Mulai AI Tutor dan Kembali ke Ruang Kelas.
- [ ] Hubungkan kartu materi siswa ke topik kelas aktif yang tepat.
- [ ] Pastikan tidak ada kubus, balok, tabung, bola, atau materi kelas non-7 dalam komponen baru.

## Verification checklist
- [ ] Verifikasi presensi menampilkan Matematika kelas VII-A dan nama siswa demo.
- [ ] Verifikasi sinopsis topik segitiga tidak menampilkan materi bangun ruang sisi lengkung.
- [ ] Verifikasi sinopsis garis mencakup empat jenis garis yang ditetapkan.
- [ ] Verifikasi kuis menerima pilihan, menampilkan jawaban benar/salah, lalu lanjut ke soal berikutnya.
- [ ] Verifikasi skor akhir dan tim Pengintai/Navigator dihitung dari jawaban aktual.
- [ ] Verifikasi tombol Mulai AI Tutor membuka sesi tutor untuk topik yang sama.
- [ ] Verifikasi tombol keluar mengembalikan siswa ke Beranda/Ruang Kelas tanpa crash.
- [ ] Verifikasi layout responsive pada mobile dan desktop.
- [ ] Jalankan lint dan build melalui workflow framework setelah implementasi.
