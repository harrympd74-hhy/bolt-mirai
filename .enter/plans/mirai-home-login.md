# Rencana: Workspace Pembelajaran Guru yang Bisa Diisi Manual

## Context
Menu Pembelajaran guru masih memiliki submenu placeholder. Pengguna meminta guru dapat mengisi manual seluruh isi Pembelajaran, dengan Rencana Pembelajaran berbentuk tabel yang merangkum Pertemuan Kelas, Asesmen, Materi & Konten, AI Tutor, Refleksi Siswa, dan Aktivitas Kolaboratif. Form materi mengikuti referensi: upload file, judul, kelas, jenis file, akses siswa, dan deskripsi.

## Pendekatan
1. Buat store UjiBetaversiMIrai untuk rencana pembelajaran dan item pendukung.
2. Buat `LearningPlanWorkspace` sebagai tabel Rencana Pembelajaran yang menggabungkan data dari submenu pendukung.
3. Buat `LearningContentModal` dengan dropzone/upload file, judul, kelas, jenis file, akses siswa, deskripsi, dan tombol simpan.
4. Buat `LearningSubmenuWorkspace` untuk Asesmen, Materi & Konten, AI Tutor, Refleksi Siswa, dan Aktivitas Kolaboratif.
5. Hubungkan semua submenu Pembelajaran dari `GuruDashboard`. Data yang diterbitkan ke kelas siswa memakai store pembelajaran bersama pada mode UjiBetaversiMIrai; backend tetap dipakai bila Auth tersedia.

## File yang dibuat/diubah
- `src/data/learningPlanStore.ts`
- `src/components/guru/LearningPlanWorkspace.tsx`
- `src/components/guru/LearningContentModal.tsx`
- `src/components/guru/LearningSubmenuWorkspace.tsx`
- `src/pages/GuruDashboard.tsx`
- `src/components/shared/StudentMeetingContent.tsx`

## Batasan
- Data UjiBetaversiMIrai bukan data produksi.
- Upload hanya menerima format yang disetujui dan tidak menyimpan password/token.
- Backend/Auth tetap menjadi sumber produksi bila tersedia.

## Implementation checklist
- [ ] Buat store rencana pembelajaran dan item pendukung dengan seed UjiBetaversiMIrai.
- [ ] Buat tabel Rencana Pembelajaran yang menggabungkan data submenu.
- [ ] Buat modal input materi sesuai layout referensi.
- [ ] Validasi file PDF, DOC, DOCX, PPT, PPTX, Video, Image dan batas ukuran.
- [ ] Buat workspace Asesmen, Materi, AI Tutor, Refleksi, dan Aktivitas Kolaboratif.
- [ ] Hubungkan semua submenu Pembelajaran dari GuruDashboard.
- [ ] Hubungkan item yang diterbitkan ke konten siswa.
- [ ] Jalankan pnpm run check dan pnpm run build.

## Verification checklist
- [ ] Rencana Pembelajaran tampil sebagai tabel dengan kolom submenu pendukung.
- [ ] Guru dapat menambah dan mengedit baris rencana.
- [ ] Modal materi memiliki upload/dropzone, judul, kelas, jenis file, akses siswa, deskripsi, dan simpan.
- [ ] Materi/tugas diterbitkan muncul pada ruang siswa.
- [ ] Semua submenu Pembelajaran tidak lagi placeholder.
- [ ] Data dapat diuji tanpa admin dalam mode UjiBetaversiMIrai.
- [ ] Tidak ada password/token/secret pada store atau UI.
- [ ] pnpm run check dan pnpm run build berhasil.
