# Rencana: Edit Tanggal, Warna, Materi, dan Asesmen Pertemuan

## Context
Kartu Pertemuan Kelas guru sudah mengikuti pola visual referensi, tetapi editornya belum mengubah tanggal/jam dan belum memilih materi atau asesmen dari submenu terkait. Pengguna meminta kartu dapat diedit seperti referensi serta sumber Bahan dan Tugas berasal dari data yang sudah dibuat di Pembelajaran.

## Pendekatan
1. Tambahkan `accentColor` pada model meeting dan pilihan palet aman: teal, biru, kuning, krem, dan abu-abu; hindari warna gelap, pink, dan ungu.
2. Perluas modal edit dengan input tanggal, waktu mulai/selesai, warna kartu, dan status.
3. Tambahkan selector Materi dan Asesmen di modal berdasarkan `learningPlanStore`; item yang dipilih disimpan melalui `meetingId`.
4. Hitung jumlah Bahan dari item type `Materi` dan jumlah Tugas dari item type `Asesmen` yang memiliki `meetingId` kartu.
5. Jadikan kartu clickable untuk membuka editor/detail; status locked tetap tidak dapat diedit.
6. Sinkronkan store sehingga perubahan terlihat di Rencana Pembelajaran dan kartu siswa dalam mode UjiBetaversiMIrai.

## File yang dibuat/diubah
- `src/data/classMeetingStore.ts`: `accentColor`, operasi update, seed.
- `src/data/learningPlanStore.ts`: relasi `meetingId`, update item, daftar Materi/Asesmen.
- `src/components/guru/ClassMeetingsBoard.tsx`: kartu, edit tanggal/jam/warna, selector materi/asesmen.
- `src/components/guru/LearningContentModal.tsx`: simpan materi ke meeting pilihan.
- `src/components/guru/LearningPlanWorkspace.tsx`: tampilkan relasi meeting.
- `src/components/shared/StudentMeetingCards.tsx`: gunakan tanggal/status/warna published yang sama.

## Implementation checklist
- [ ] Tambahkan field warna pada meeting dan seed warna aman.
- [ ] Tambahkan edit tanggal, waktu mulai, waktu selesai, status, dan warna.
- [ ] Tambahkan pilihan Materi dari submenu Materi & Konten.
- [ ] Tambahkan pilihan Asesmen dari submenu Asesmen.
- [ ] Hitung jumlah bahan/tugas per meeting berdasarkan relasi `meetingId`.
- [ ] Sinkronkan perubahan ke rencana pembelajaran dan kartu siswa.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Guru dapat mengubah tanggal dan jam kartu.
- [ ] Guru dapat memilih warna kartu dari palet non-gelap/non-pink/non-ungu.
- [ ] Klik Bahan membuka/menunjukkan materi dari submenu Materi.
- [ ] Klik Tugas membuka/menunjukkan asesmen dari submenu Asesmen.
- [ ] Jumlah Bahan/Tugas berubah sesuai item terkait.
- [ ] Meeting published dengan perubahan yang sama tampil di siswa.
- [ ] Meeting terkunci tetap tidak dapat diedit.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
