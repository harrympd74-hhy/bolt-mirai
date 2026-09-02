# Rencana: Ruang Kelas Siswa Terhubung Pertemuan Aktif dan AI Tutor

## Context
Ruang Kelas siswa perlu mengikuti referensi: breadcrumb kelas/materi, banner materi berwarna, viewer materi guru, tab format, navigasi sebelumnya/selanjutnya, ringkasan pemahaman, dan panel AI Tutor. Materi harus berasal dari link/file yang guru siapkan pada kartu pertemuan aktif; AI Tutor memakai backend yang sudah tersedia.

## Pendekatan
1. Refactor `RuangBelajar`/ruang kelas aktif menjadi `StudentLearningRoom` dengan konteks meeting aktif.
2. Ambil meeting published yang sedang aktif dari `class-meetings`; pilih material terkait berdasarkan meeting payload. Jika tidak ada materi, tampilkan empty state yang jelas, bukan materi acak.
3. Tampilkan viewer link/file guru: tombol Word/PDF/PPT/Video, area preview link aman, nama materi, kelas, bab, dan tombol unduh bila URL tersedia.
4. Tambahkan panel AI Tutor di sisi kanan dengan chat yang memanggil backend function AI Tutor yang sudah ada; fallback UjiBetaversiMIrai hanya jika backend tidak merespons. Tidak menyimpan password/API key di client.
5. Tambahkan ringkasan pemahaman, latihan soal, kuis, navigasi sebelumnya/selanjutnya, dan CTA bertanya ke AI Tutor dengan data meeting aktif.

## File yang dibuat/diubah
- `src/pages/siswa/RuangBelajar.tsx`: layout ruang kelas referensi dan viewer materi.
- `src/components/student/StudentLearningRoom.tsx`: komponen utama ruang belajar.
- `src/components/student/MaterialViewer.tsx`: preview/link/file material guru.
- `src/components/student/AITutorPanel.tsx`: panel AI Tutor terhubung backend.
- `src/components/shared/ActiveStudentClassroom.tsx`: kirim konteks meeting aktif.
- `src/components/shared/StudentMeetingContent.tsx`: gunakan material meeting aktif.

## Batasan keamanan
- Hanya material dari meeting published yang aktif dan kelas siswa yang ditampilkan.
- URL eksternal dibuka dengan `target="_blank"` dan `rel="noreferrer"`.
- Tidak menyimpan kredensial guru/siswa/provider AI.
- Fallback lokal diberi label UjiBetaversiMIrai.

## Implementation checklist
- [ ] Buat layout ruang kelas dua kolom sesuai referensi.
- [ ] Hubungkan material/link guru dari meeting aktif.
- [ ] Tambahkan viewer format Word/PDF/PPT/Video dan link.
- [ ] Tambahkan breadcrumb, banner materi, navigasi materi, dan ringkasan belajar.
- [ ] Tambahkan panel AI Tutor dengan backend function yang sudah ada.
- [ ] Tambahkan fallback UjiBetaversiMIrai jika AI backend gagal.
- [ ] Hubungkan ruang kelas dari menu siswa dan kartu meeting aktif.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Ruang Kelas menampilkan judul dan materi dari meeting aktif guru yang benar.
- [ ] Material meeting lain atau draft tidak tampil.
- [ ] Link guru dapat dibuka dan viewer menampilkan format yang sesuai.
- [ ] Chat AI Tutor dapat mengirim pertanyaan dan menerima respons.
- [ ] Fallback UjiBetaversiMIrai muncul saat backend AI tidak merespons.
- [ ] Navigasi sebelumnya/selanjutnya dan ringkasan belajar berfungsi.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
