# Rencana: Hubungkan Materi Guru ke Jendela Ilmu Siswa

## Context
Materi & Konten guru sudah tampil dalam tabel, tetapi belum menjadi sumber langsung untuk menu Jendela Ilmu siswa dan belum memiliki edit materi/link yang lengkap. Pengguna meminta guru dapat mengedit materi/link, lalu siswa dapat membaca materi yang berstatus diterbitkan.

## Pendekatan
1. Perluas `LearningItem` dengan `meetingId`, `url`, `fileName`, `access`, dan `status`.
2. Tambahkan operasi `update`, `publish`, dan `remove` pada `learningPlanStore` dengan subscribe perubahan.
3. Ubah tabel Materi & Konten agar tombol Edit membuka modal yang sama, dan setiap baris menampilkan tombol Terbitkan/Sembunyikan.
4. Perluas `LearningContentModal` untuk edit judul, kelas, jenis file, akses siswa, deskripsi, link, dan meeting terkait. Validasi URL/link dan ekstensi file.
5. Buat `StudentKnowledgePage` untuk menu Jendela Ilmu siswa: hanya menampilkan materi type Materi dan status Diterbitkan, dengan search/filter kelas dan tombol Baca/Buka Link.
6. Pastikan materi yang terbit dapat dipakai pada viewer Ruang Kelas jika memiliki meetingId; data UjiBetaversiMIrai dipakai sebagai fallback tanpa admin.

## File yang dibuat/diubah
- `src/data/learningPlanStore.ts`: model URL/file/akses, update/publish/remove.
- `src/components/guru/LearningPlanWorkspace.tsx`: tombol edit, terbitkan, sembunyikan.
- `src/components/guru/LearningContentModal.tsx`: form create/edit materi/link.
- `src/pages/siswa/StudentKnowledgePage.tsx`: halaman Jendela Ilmu siswa.
- `src/pages/SiswaDashboard.tsx`: routing menu Jendela Ilmu.
- `src/components/shared/StudentMeetingContent.tsx`: memakai material terbit terkait meeting aktif.

## Implementation checklist
- [ ] Perluas tipe dan store materi dengan URL, file, akses, meetingId, dan operasi update/publish.
- [ ] Tambahkan tombol Edit pada tabel Materi & Konten.
- [ ] Tambahkan tombol Terbitkan/Sembunyikan untuk kontrol visibilitas siswa.
- [ ] Perluas modal input untuk link materi dan mode edit.
- [ ] Buat halaman Jendela Ilmu siswa dengan daftar materi terbit dan pencarian.
- [ ] Hubungkan Jendela Ilmu ke sidebar siswa.
- [ ] Hubungkan materi terbit ke viewer Ruang Kelas aktif.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Guru dapat menambah materi/link dari Materi & Konten.
- [ ] Guru dapat mengedit judul, kelas, link, file, deskripsi, akses, dan meeting terkait.
- [ ] Materi Draft tidak muncul di Jendela Ilmu siswa.
- [ ] Setelah diterbitkan, materi muncul di Jendela Ilmu siswa.
- [ ] Siswa dapat membuka link/materi yang diterbitkan.
- [ ] Materi terkait meeting aktif tampil di Ruang Kelas.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
