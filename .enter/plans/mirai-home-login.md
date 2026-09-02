# Rencana: Revisi Pertemuan Kelas Guru

## Context
Halaman Pertemuan Kelas guru perlu mengikuti referensi visual: kartu dua kolom, nomor besar, tanggal/waktu, status warna, jumlah bahan/tugas, serta aksi edit. Data kartu harus terhubung dengan Pertemuan, Materi & Konten, Asesmen, Refleksi, dan Aktivitas Kolaboratif.

## Pendekatan
1. Perluas `learningPlanStore` agar item pembelajaran memiliki `meetingId`, sehingga materi, asesmen, refleksi, dan aktivitas dapat dihitung per pertemuan.
2. Tambahkan seed delapan pertemuan UjiBetaversiMIrai dengan status dan tanggal sesuai referensi.
3. Refactor `ClassMeetingsPage` menjadi grid kartu dua kolom dengan warna status `Selesai`, `Belum Aktif`, `Akan datang`, `Sebagian Selesai`, dan `Terkunci`.
4. Tambahkan modal edit pertemuan yang bisa mengubah nomor, judul, kelas, tanggal, jam, status, dan keterkaitan data pembelajaran.
5. Kartu menampilkan jumlah bahan dari Materi & Konten, jumlah tugas dari Asesmen, serta indikator refleksi/aktivitas bila tersedia.
6. Sinkronkan perubahan store ke Rencana Pembelajaran dan konten siswa pada mode UjiBetaversiMIrai; backend tetap dipakai bila data produksi tersedia.

## File yang dibuat/diubah
- `src/data/learningPlanStore.ts`: relasi meeting dan operasi update.
- `src/data/classMeetingStore.ts`: delapan seed meeting, status, dan subscribe.
- `src/pages/guru/ClassMeetingsPage.tsx`: UI kartu referensi, edit, dan relasi submenu.
- `src/components/guru/LearningPlanWorkspace.tsx`: konsumsi relasi meeting dan agregasi bahan/tugas.
- `src/components/guru/LearningContentModal.tsx`: menyimpan materi dengan meeting terkait.
- `src/components/shared/StudentMeetingCards.tsx`: membaca meeting published yang sama.

## Implementation checklist
- [ ] Buat store meeting UjiBetaversiMIrai berisi delapan pertemuan sesuai referensi.
- [ ] Tambahkan relasi `meetingId` pada item pembelajaran dan fungsi update.
- [ ] Refactor kartu Pertemuan Kelas menjadi grid dua kolom dengan status dan legenda.
- [ ] Tambahkan modal edit pertemuan dan validasi tanggal/jam.
- [ ] Hitung jumlah bahan/tugas dari submenu terkait pada setiap kartu.
- [ ] Sinkronkan perubahan meeting ke Rencana Pembelajaran dan kartu siswa.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Delapan kartu tampil dalam pola dua kolom seperti referensi.
- [ ] Setiap kartu menampilkan nomor, judul, tanggal, jam, status, bahan, dan tugas.
- [ ] Guru dapat mengedit kartu dan perubahan langsung terlihat di Rencana Pembelajaran.
- [ ] Menambahkan materi/asesmen pada submenu terkait mengubah jumlah pada kartu.
- [ ] Meeting published tampil pada dasbor siswa; draft/terkunci tidak dapat dibuka siswa.
- [ ] Label UI memakai UjiBetaversiMIrai, bukan “Demo”.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
