# Rencana: Ruang Kelas Siswa Terhubung Pertemuan Aktif dan AI Tutor

## Context
Ruang Kelas siswa perlu mengikuti referensi: breadcrumb, banner materi, viewer materi guru, tab format, navigasi, ringkasan pemahaman, dan panel AI Tutor. Materi harus berasal dari link/file yang guru siapkan pada card pertemuan aktif; AI Tutor memakai backend yang sudah tersedia.

## Pendekatan
1. Refactor `RuangBelajar` menjadi ruang belajar dengan konteks meeting aktif.
2. Ambil meeting published dan aktif dari `class-meetings`, lalu gunakan material terkait meeting tersebut. Jika tidak ada materi, tampilkan empty state, bukan materi acak.
3. Tampilkan viewer link/file guru dengan tab Word/PDF/PPT/Video, nama materi, kelas, bab, unduh, dan navigasi.
4. Tambahkan panel AI Tutor dua kolom yang memanggil backend AI Tutor; fallback UjiBetaversiMIrai hanya jika backend gagal.
5. Tambahkan ringkasan konsep, latihan soal, kuis, dan CTA bertanya berdasarkan meeting aktif.

## File yang dibuat/diubah
- `src/pages/siswa/RuangBelajar.tsx`
- `src/components/student/StudentLearningRoom.tsx`
- `src/components/student/MaterialViewer.tsx`
- `src/components/student/AITutorPanel.tsx`
- `src/components/shared/ActiveStudentClassroom.tsx`
- `src/components/shared/StudentMeetingContent.tsx`

## Batasan keamanan
- Hanya material dari meeting published yang aktif dan kelas siswa yang ditampilkan.
- URL eksternal dibuka dengan `target="_blank"` dan `rel="noreferrer"`.
- Tidak menyimpan kredensial guru/siswa/provider AI.
- Fallback lokal diberi label UjiBetaversiMIrai.

## Implementation checklist
- [ ] Buat layout ruang kelas dua kolom sesuai referensi.
- [ ] Hubungkan material/link guru dari meeting aktif.
- [ ] Tambahkan viewer format Word/PDF/PPT/Video dan link.
- [ ] Tambahkan breadcrumb, banner, navigasi, dan ringkasan belajar.
- [ ] Tambahkan panel AI Tutor dengan backend function yang ada.
- [ ] Tambahkan fallback UjiBetaversiMIrai.
- [ ] Hubungkan ruang kelas dari menu siswa dan kartu meeting aktif.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Ruang Kelas menampilkan materi dari card meeting guru yang `isActive`.
- [ ] Material meeting lain/draft tidak tampil.
- [ ] Link/file guru dapat dibuka atau diunduh.
- [ ] Chat AI Tutor mengirim pertanyaan dan menampilkan respons.
- [ ] Fallback UjiBetaversiMIrai muncul saat backend AI gagal.
- [ ] Navigasi dan ringkasan belajar berfungsi.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
