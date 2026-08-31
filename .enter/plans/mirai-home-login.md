# Rencana: Pertemuan Kelas dan Persiapan Kelas Guru

## Context
Pengguna meminta fitur baru pada submenu **Rencana Pembelajaran** di dasbor guru, dengan tampilan kartu Pertemuan Kelas seperti referensi: kartu horizontal/scrollable, status berwarna, ringkasan bahan ajar dan tugas, serta aksi Siapkan/Lihat Detail. Pertemuan yang disiapkan guru harus muncul di Ruang Kelas siswa bersama bahan ajar, tugas, file, dan link pembelajaran.

## Pendekatan
1. Tambahkan submenu **Pertemuan Kelas** di bawah **Rencana Pembelajaran** pada konfigurasi navigasi guru.
2. Buat tabel backend `class_meetings`, `meeting_materials`, dan `meeting_assignments` dengan RLS aktif. Pertemuan mengacu ke `teacher_profiles`, kelas, dan jadwal; materials/assignments mengacu ke meeting. Data siswa akan membaca hanya meeting yang dipublikasikan untuk kelasnya.
3. Buat backend function `class-meetings` untuk list/create/update/delete meeting, publish/unpublish, serta create/update/delete materials dan assignments. Semua mutasi diverifikasi sebagai guru pemilik meeting atau admin; pembacaan siswa dibatasi kelas dan status published.
4. Buat UI `ClassMeetingsPage` bergaya clean-professional sesuai referensi: header, tombol `+ Tambah Pertemuan`, kartu grid horizontal responsif, border/shadow status, ikon kalender/jam, jumlah bahan/tugas, legenda, dan status baru **Belum Aktif**.
5. Terapkan logika status dinamis:
   - `Belum Aktif` jika waktu KBM masih lebih dari 4 hari dan/atau lebih dari 2 jam sesuai aturan yang disepakati;
   - `Akan datang` saat sudah mendekati waktu KBM;
   - `Selesai`/`Sebagian Selesai` dari status tugas;
   - `Terkunci` untuk meeting yang tidak dapat diedit.
6. Buat `ClassMeetingPreparation` untuk menambah/edit bahan ajar dan tugas. Upload menggunakan storage Enter Cloud melalui skill storage, dengan validasi ekstensi `.doc`, `.docx`, `.pdf`, `.ppt`, `.pptx`, `.flash`, `.flipbook`, `.mp4`; link Google Drive/YouTube dan URL umum disimpan sebagai link.
7. Tambahkan tampilan konten meeting terbit di ruang siswa yang membaca meeting published beserta material, assignment, file URL, dan learning links.

## File yang dibuat/diubah
- `src/components/guru/navConfig.ts`: submenu `Pertemuan Kelas` di bawah `Rencana Pembelajaran`.
- `src/pages/guru/ClassMeetingsPage.tsx`: daftar kartu dan status.
- `src/pages/guru/ClassMeetingPreparation.tsx`: editor bahan ajar/tugas/upload/link.
- `src/components/shared/ClassMeetingCard.tsx`: kartu reusable guru.
- `src/components/shared/StudentMeetingContent.tsx`: konten meeting untuk ruang siswa.
- `src/pages/GuruDashboard.tsx`: routing submenu baru dan halaman persiapan.
- `src/pages/SiswaDashboard.tsx` serta `src/pages/siswa/RuangKelasAktif.tsx`: tampilkan meeting/material/assignment terbit.
- Migration melalui `supabase_migration`: tiga tabel, foreign key, index, timestamps, dan RLS.
- `supabase/functions/class-meetings/index.ts`: CRUD dan filtering role/ownership/class.
- Storage Enter Cloud melalui skill resource upload untuk file bahan ajar.
- Generated `src/integrations/supabase/types.ts` hanya diregenerasi otomatis, tidak diedit manual.

## Batasan keamanan
- Password, token, dan secret tidak disimpan dalam materials atau assignment.
- Guru hanya dapat mengedit meeting yang dimilikinya; siswa hanya membaca meeting published di kelasnya.
- RLS aktif pada semua tabel baru pada migration yang sama.
- Validasi tipe file dan ukuran dilakukan sebelum upload; link eksternal tidak dipercaya untuk menjalankan script.

## Implementation checklist
- [ ] Tambahkan submenu `Pertemuan Kelas` pada `navConfig.ts` di bawah `Rencana Pembelajaran`.
- [ ] Buat migration tiga tabel dengan RLS, FK, index, dan policy guru/siswa/admin yang tepat.
- [ ] Verifikasi schema dan policy RLS setelah migration.
- [ ] Implementasikan dan deploy backend function `class-meetings` untuk CRUD, publish, materials, assignments, dan role filtering.
- [ ] Buat kartu meeting dengan status warna, ringkasan, aksi, dan legenda sesuai referensi.
- [ ] Buat form tambah/edit pertemuan dengan jadwal, kelas, materi, dan status terkunci.
- [ ] Buat halaman Persiapan Kelas untuk bahan ajar, tugas, upload file valid, dan link pembelajaran.
- [ ] Hubungkan upload storage tanpa menaruh file privat atau token di client response yang tidak perlu.
- [ ] Tampilkan meeting terbit beserta materials/assignments pada ruang siswa.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Submenu `Pertemuan Kelas` tampil di bawah `Rencana Pembelajaran` dan membuka halaman baru.
- [ ] Kartu menampilkan nomor, judul, tanggal/waktu, status, jumlah bahan, jumlah tugas, dan aksi yang benar.
- [ ] Status `Belum Aktif` berubah menjadi `Akan datang` mengikuti aturan waktu.
- [ ] Guru dapat menambah/edit meeting dan menyiapkan bahan/tugas.
- [ ] File ekstensi yang diizinkan diterima; ekstensi lain ditolak dengan pesan jelas.
- [ ] Link pembelajaran tersimpan dan tampil sebagai link aman.
- [ ] Guru lain tidak dapat mengedit meeting milik guru berbeda.
- [ ] Siswa hanya melihat meeting published untuk kelasnya.
- [ ] Bahan ajar, tugas, file, dan link tampil di Ruang Kelas siswa setelah diterbitkan.
- [ ] Status terkunci menonaktifkan aksi Siapkan.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
