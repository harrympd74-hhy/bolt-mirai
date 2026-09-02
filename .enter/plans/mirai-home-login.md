# Rencana: Latihan Soal Lima Langkah di Ruang Kelas Siswa

## Context
Saat siswa menekan kartu **Latihan Soal** pada Ruang Kelas, perlu dibuka halaman latihan sesuai referensi gambar: soal sudut di bagian atas, lima langkah pengerjaan berurutan, area jawaban setiap langkah, dan area Jawaban Akhir.

## Pendekatan
1. Buat `ProblemSolvingPage` sebagai halaman mandiri dengan tombol kembali ke Ruang Kelas.
2. Tampilkan soal demo: menentukan besar sudut a, b, dan c dari dua garis berpotongan dengan sudut 60°.
3. Buat 5 kartu langkah dengan judul, deskripsi instruksi, textarea, warna aksen, dan indikator nomor langkah.
4. Tambahkan textarea Jawaban Akhir dan tombol Simpan Progres; data jawaban hanya untuk sesi/local state UjiBetaversiMIrai.
5. Hubungkan tombol Latihan Soal di Ruang Belajar ke halaman baru tanpa mengganggu AI Tutor.

## File yang dibuat/diubah
- `src/pages/siswa/ProblemSolvingPage.tsx`: UI lima langkah sesuai referensi.
- `src/pages/siswa/RuangBelajar.tsx`: state halaman latihan dan CTA Latihan Soal.

## Implementation checklist
- [ ] Buat halaman ProblemSolvingPage dengan soal sudut dan visual diagram.
- [ ] Buat lima textarea langkah berurutan dengan warna dan ikon.
- [ ] Tambahkan textarea Jawaban Akhir dan Simpan Progres.
- [ ] Hubungkan kartu Latihan Soal dari RuangBelajar.
- [ ] Tambahkan tombol kembali ke Ruang Kelas.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Klik Latihan Soal membuka halaman sesuai struktur gambar.
- [ ] Lima langkah dapat diisi manual.
- [ ] Jawaban Akhir dapat diisi dan disimpan untuk sesi saat ini.
- [ ] Tombol kembali mengembalikan siswa ke Ruang Kelas.
- [ ] Panel AI Tutor tetap berfungsi di Ruang Belajar.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
