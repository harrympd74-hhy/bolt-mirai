# Rencana Pembagian Kelompok Siswa Berdasarkan Nilai

## Context
Setelah kuis Ruang Kelas selesai, siswa harus dikelompokkan berdasarkan nilai akhir. Aturan yang disepakati adalah nilai 0–60 masuk **Kelompok Penjelajar**, sedangkan nilai 61–100 masuk **Kelompok Pengintai**. Saat ini komponen masih menghitung jumlah jawaban benar dan belum menampilkan nilai persentase maupun label kelompok.

## Pendekatan yang direkomendasikan
- Mengubah perhitungan hasil kuis di `src/pages/siswa/RuangKelasAktif.tsx` dari jumlah benar menjadi nilai persentase: `jawaban benar / jumlah soal × 100`.
- Menetapkan batas secara eksplisit dengan aturan `nilai > 60` untuk Kelompok Pengintai; seluruh nilai `<= 60`, termasuk tepat 60, masuk Kelompok Penjelajar.
- Menampilkan nilai angka, jumlah jawaban benar, dan kelompok pada layar hasil.
- Mengubah tombol lanjutan agar Kelompok Penjelajar diarahkan ke AI Tutor sebagai pendampingan penguatan, sedangkan Kelompok Pengintai diarahkan ke AI Tutor sebagai tantangan pengayaan; keduanya tetap memakai alur tutor demo lokal.
- Mempertahankan topik kelas 7: Bangun Ruang Segitiga dan Jenis-Jenis Garis, serta tidak mengubah dashboard admin/guru.

## File kritis
- `src/pages/siswa/RuangKelasAktif.tsx`: perhitungan nilai, aturan kelompok, dan tampilan hasil.
- `src/pages/SiswaDashboard.tsx`: tetap menjadi pemanggil kelas aktif dan tutor sesuai topik.

## Implementation checklist
- [ ] Hitung nilai persentase dari jawaban kuis aktual.
- [ ] Tetapkan nilai `<= 60` ke Kelompok Penjelajar.
- [ ] Tetapkan nilai `> 60` ke Kelompok Pengintai.
- [ ] Tampilkan nilai, jumlah benar, dan label kelompok pada layar hasil.
- [ ] Tampilkan deskripsi tindak lanjut yang berbeda untuk kedua kelompok.
- [ ] Pertahankan tombol AI Tutor dengan topik kuis yang sedang dipelajari.

## Verification checklist
- [ ] Verifikasi nilai 60 menghasilkan Kelompok Penjelajar.
- [ ] Verifikasi nilai 61 menghasilkan Kelompok Pengintai.
- [ ] Verifikasi nilai 0 dan nilai 100 masuk kelompok yang benar.
- [ ] Verifikasi skor kuis tiga soal menghasilkan persentase yang benar.
- [ ] Verifikasi hasil tetap sesuai untuk kedua topik kelas 7.
- [ ] Verifikasi tombol tutor dan keluar dari hasil tetap berfungsi.
- [ ] Jalankan lint dan build proyek melalui workflow framework setelah implementasi.
