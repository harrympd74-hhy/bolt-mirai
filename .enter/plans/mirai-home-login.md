# Rencana: Tampilan Ruang Kelas Aktif Guru (Sesuai Referensi)

## Context
Ketika guru menekan tombol **Masuk Kelas** pada kartu kelas aktif di `Kelas Saya > Kelas Aktif`, tampilan ruang kelas aktif guru harus persis seperti gambar referensi `{D7BCE704-73C8-4740-A800-1A80DDFAAC47}.png`:
1. Header "Ruang Kelas - Kelas 7A" dengan subtitle, pemilih tanggal, dan tombol "Ekspor Laporan".
2. Kartu "Materi Terbaru" dengan preview diagram, judul, tanggal terbit, deskripsi, tag, dan pill lampiran (PPT, PDF, Video, Worksheet).
3. Kartu "Ringkasan Kelas" dengan 4 indikator agregat (Struggle Lifetime 62%, Pemecahan Masalah 58%, Tugas Ketercapaian 72%, Siswa Perlu Pendampingan 9 Siswa) beserta sparkline.
4. Tabel "Performa Siswa" berisi 10 siswa dengan avatar, progress bar berwarna (Hijau Baik >=75%, Kuning Sedang 50-74%, Merah Perlu Pendampingan <50%), rekomendasi Tutor Sebaya, dan tombol Detail.

## Pendekatan
1. Buat komponen `TeacherActiveRoomDetail.tsx` yang memuat seluruh layout referensi secara presisi.
2. Di dalam `ActiveClassWorkspace.tsx`, saat guru menekan tombol **Masuk Kelas**, tampilkan komponen `TeacherActiveRoomDetail` dengan tombol "Kembali ke Kelas Aktif".
3. Sertakan data 10 siswa dengan skor, status, dan rekomendasi tutor sebaya sesuai contoh referensi.
4. Tambahkan modal detail siswa ketika tombol "Detail" pada baris siswa diklik.

## File yang dibuat/diubah
- `src/components/guru/TeacherActiveRoomDetail.tsx`: Komponen tampilan lengkap Ruang Kelas Aktif Guru.
- `src/components/guru/ActiveClassWorkspace.tsx`: Hubungkan klik "Masuk Kelas" ke `TeacherActiveRoomDetail`.

## Implementation checklist
- [ ] Buat komponen `TeacherActiveRoomDetail.tsx` dengan header, pemilih tanggal, ekspor laporan, kartu Materi Terbaru, kartu Ringkasan Kelas, dan tabel Performa Siswa 10 siswa.
- [ ] Integrasikan `TeacherActiveRoomDetail` ke `ActiveClassWorkspace.tsx` saat mode `selected` aktif.
- [ ] Tambahkan modal/popover Detail Siswa.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Menekan tombol "Masuk Kelas" membuka tampilan "Ruang Kelas - Kelas 7A" persis seperti gambar referensi.
- [ ] Kartu Materi Terbaru menampilkan diagram, tag, dan pill lampiran PPT/PDF/Video/Worksheet.
- [ ] Kartu Ringkasan Kelas menampilkan 4 metric dengan sparkline graph.
- [ ] Tabel Performa Siswa menampilkan 10 siswa dengan progress bar berwarna (Hijau, Kuning, Merah).
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
