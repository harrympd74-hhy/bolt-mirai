# Rencana: Hubungkan Guru Langsung ke Dasbor Siswa

## Context
Guru sudah dapat membuat pertemuan dan menambahkan materi/tugas, tetapi saat Auth/admin belum siap, alur publikasi belum mudah diuji. Pengguna meminta guru dapat langsung memberikan materi dan soal yang tampil di dasbor siswa tanpa menunggu admin memperbarui data.

## Pendekatan
1. Tambahkan mode demo bersama menggunakan store browser untuk meeting guru dan siswa. Guru membuat meeting, menambahkan materi/link/tugas, lalu menekan `Terbitkan ke Siswa`; siswa membaca meeting published tanpa admin.
2. Pertahankan backend sebagai jalur produksi: jika sesi guru/siswa tersedia, gunakan `class-meetings`; fallback demo hanya aktif saat backend/Auth belum tersedia dan diberi label Demo.
3. Meeting draft tidak muncul di siswa. Meeting published muncul pada kartu Pertemuan siswa dan materinya masuk Ruang Kelas saat aktif.
4. Simpan hanya data pembelajaran non-rahasia di localStorage. Password, token, dan secret tidak pernah disimpan.

## File yang dibuat/diubah
- `src/data/demoClassroomStore.ts`: store meeting/material/tugas bersama.
- `src/pages/guru/ClassMeetingsPage.tsx`: fallback demo dan tombol terbitkan.
- `src/components/shared/StudentMeetingCards.tsx`: baca meeting published.
- `src/components/shared/StudentMeetingContent.tsx`: tampilkan materi/link/tugas.
- `src/components/shared/ActiveStudentClassroom.tsx`: gunakan meeting published aktif.

## Implementation checklist
- [ ] Buat store demo meeting dengan seed, subscribe perubahan, create/update/publish, dan material/tugas.
- [ ] Tambahkan fallback store pada halaman guru saat backend kosong/gagal.
- [ ] Tambahkan aksi `Terbitkan ke Siswa` dan indikator Draft/Published.
- [ ] Hubungkan kartu siswa ke meeting published dari store demo bila backend belum siap.
- [ ] Hubungkan Ruang Kelas siswa ke meeting aktif dari store yang sama.
- [ ] Pastikan materi, link, dan tugas guru tampil di siswa.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Guru membuat meeting baru dan melihatnya di daftar guru.
- [ ] Draft tidak muncul di siswa.
- [ ] Setelah diterbitkan, kartu muncul di dasbor siswa.
- [ ] Materi/link dan tugas terlihat saat meeting aktif.
- [ ] Perubahan guru tersinkron pada tab yang sama tanpa admin.
- [ ] Jalur backend tetap digunakan saat sesi produksi tersedia.
- [ ] Tidak ada secret/password dalam store demo.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
