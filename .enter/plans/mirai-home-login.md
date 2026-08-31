# Rencana: Revisi Ruang Pertemuan dan Ruang Kelas Siswa

## Context
Dasbor siswa saat ini masih mencampur menu Ruang Pertemuan dengan alur Ruang Kelas aktif. Pengguna meminta Ruang Pertemuan hanya menampilkan daftar kartu pertemuan seperti referensi, sedangkan Ruang Kelas hanya menampilkan pertemuan yang sedang aktif berdasarkan pertemuan yang dibuat/dipublikasikan guru.

## Pendekatan
1. Buat komponen `StudentMeetingCards` yang mengambil data meeting published dari backend `class-meetings` dan menampilkan kartu dua kolom responsif seperti referensi: nomor besar, judul, tanggal/waktu, status, jumlah bahan, dan jumlah tugas.
2. Pisahkan status siswa menjadi `Selesai`, `Belum Aktif`, dan `Sedang Berlangsung/Akan datang` berdasarkan waktu meeting serta status publikasi. Kartu hanya menjadi daftar informasi dan pintu masuk, tanpa editor atau form guru.
3. Ubah menu **Ruang Pertemuan** agar membuka halaman kartu tersebut saja.
4. Buat komponen `ActiveStudentClassroom` yang memfilter meeting published berdasarkan kelas siswa dan hanya menampilkan meeting aktif pada waktu sekarang. Jika tidak ada meeting aktif, tampilkan empty state dengan jadwal pertemuan berikutnya dan tombol kembali.
5. Ubah menu **Ruang Kelas** agar membuka `ActiveStudentClassroom`, bukan langsung memakai materi demo. Saat kartu meeting aktif dipilih dari Ruang Pertemuan, buka ruang pembelajaran yang sama dengan konteks meeting tersebut.
6. Pertahankan fallback demo hanya untuk preview tanpa sesi backend; beri label Demo dan jangan mencampurnya dengan data meeting nyata.

## File yang dibuat/diubah
- `src/components/shared/StudentMeetingCards.tsx`: daftar kartu Ruang Pertemuan sesuai referensi.
- `src/components/shared/ActiveStudentClassroom.tsx`: filter dan tampilan ruang kelas aktif.
- `src/pages/SiswaDashboard.tsx`: routing terpisah Ruang Pertemuan vs Ruang Kelas.
- `src/pages/siswa/RuangKelasAktif.tsx`: menerima konteks meeting aktif bila dipilih.
- `src/components/shared/StudentMeetingContent.tsx`: tetap dipakai untuk bahan/tugas meeting aktif.

## Implementation checklist
- [ ] Buat `StudentMeetingCards` dengan layout kartu dua kolom dan status visual sesuai referensi.
- [ ] Hubungkan kartu ke `class-meetings` dengan mode baca siswa dan filter published.
- [ ] Pisahkan klik menu `Ruang Pertemuan` ke daftar kartu, tanpa membuka ruang aktif otomatis.
- [ ] Buat `ActiveStudentClassroom` yang hanya merender meeting aktif berdasarkan waktu sekarang.
- [ ] Hubungkan menu `Ruang Kelas` ke `ActiveStudentClassroom`.
- [ ] Tambahkan empty state jika belum ada meeting aktif dan tampilkan meeting terdekat bila tersedia.
- [ ] Pastikan bahan ajar dan tugas hanya muncul di ruang kelas ketika meeting aktif.
- [ ] Pertahankan demo fallback dengan label yang jelas.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Klik Ruang Pertemuan hanya menampilkan kartu-kartu seperti desain referensi.
- [ ] Kartu menampilkan nomor, judul, tanggal/waktu, status, jumlah bahan, dan jumlah tugas.
- [ ] Kartu meeting yang belum waktunya tidak muncul sebagai ruang kelas aktif.
- [ ] Klik Ruang Kelas menampilkan hanya meeting guru yang sedang berlangsung untuk kelas siswa.
- [ ] Jika tidak ada meeting aktif, muncul empty state yang informatif.
- [ ] Bahan ajar dan tugas meeting aktif tampil di Ruang Kelas siswa.
- [ ] Non-published meeting tidak dapat terlihat oleh siswa melalui backend maupun UI.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
