# Rencana: Modul Jadwal Terhubung Guru dan Siswa

## Context
Dasbor admin MIRAI saat ini memiliki menu jadwal tetapi masih berupa placeholder. Dasbor guru dan siswa juga menampilkan konten jadwal demo lokal. Pengguna meminta admin dapat membangun jadwal yang terhubung dengan guru dan siswa, sehingga satu jadwal berdasarkan kelas dapat terlihat oleh guru terkait dan seluruh siswa pada kelas tersebut.

## Pendekatan
1. Buat tabel `class_schedules` di backend dengan RLS aktif: kelas, mata pelajaran, guru, hari, jam mulai/selesai, ruang, semester, status, dan timestamps. Jadwal mengacu ke `teacher_profiles` bila guru tersedia; kelas menjadi penghubung ke `student_profiles.class_name`.
2. Buat backend function `schedule-management` untuk operasi admin CRUD dan pembacaan jadwal terfilter:
   - admin dapat membuat, mengedit, menghapus, dan mempublikasikan jadwal;
   - guru hanya menerima jadwal yang terkait akun/profil gurunya;
   - siswa hanya menerima jadwal berdasarkan `class_name` profil/akun siswa;
   - semua role diverifikasi di backend, bukan dari pilihan role client.
3. Tambahkan validasi bentrok: guru tidak boleh memiliki dua jadwal beririsan pada hari/jam yang sama, dan kelas tidak boleh memiliki dua mata pelajaran beririsan. Pesan konflik harus dikembalikan sebelum mutation.
4. Buat komponen admin `ScheduleManagement` dengan tampilan mingguan, filter kelas/guru, form jadwal, pilihan guru dari data profil yang ada, dan aksi edit/hapus/publikasi. Menu placeholder jadwal admin diarahkan ke komponen ini.
5. Tambahkan komponen jadwal reusable untuk dasbor guru dan siswa. Guru melihat jadwal mengajarnya; siswa melihat jadwal kelasnya. Pertahankan fallback demo hanya saat sesi autentikasi belum tersedia, dengan label jelas bahwa data tersebut demo.
6. Jangan memasukkan password, token, atau data sensitif ke JSON GitHub; data jadwal operasional disimpan di backend.

## File yang dibuat/diubah
- Migration melalui `supabase_migration`: tabel `class_schedules`, foreign key/index, RLS/policy.
- `supabase/functions/schedule-management/index.ts`: CRUD admin, query role-based, validasi konflik.
- `src/components/admin/ScheduleManagement.tsx`: kalender/list mingguan dan form admin.
- `src/components/shared/ScheduleList.tsx`: daftar jadwal reusable.
- `src/pages/AdminDashboard.tsx`: sambungkan menu jadwal dan subhalaman input/daftar.
- `src/pages/GuruDashboard.tsx` dan/atau `src/pages/guru/Beranda.tsx`: jadwal guru dari backend.
- `src/pages/SiswaDashboard.tsx`: jadwal siswa dari backend.
- `src/integrations/supabase/types.ts`: hanya regenerated otomatis oleh migrasi, tidak diedit manual.

## Batasan keamanan
- RLS aktif di migration yang membuat tabel.
- Admin check dan ownership/class filtering dilakukan backend/RLS.
- Siswa tidak dapat melihat jadwal kelas lain; guru tidak dapat mengubah jadwal dari dasbornya.
- Demo login tidak mendapatkan akses operasi backend; jadwal admin dan data nyata memerlukan sesi Auth admin.

## Implementation checklist
- [ ] Buat migration `class_schedules` dengan RLS, foreign key guru, dan index kelas/hari/waktu.
- [ ] Verifikasi schema dan policy RLS setelah migration.
- [ ] Implementasikan backend function `schedule-management` dengan aksi list, create, update, delete, publish.
- [ ] Tambahkan validasi input tanggal/jam/semester dan bentrok guru/kelas sebelum insert/update.
- [ ] Buat UI admin jadwal dengan form pilihan guru, kelas, mata pelajaran, hari, jam, ruang, semester, dan status.
- [ ] Hubungkan menu `jadwalPembelajaran` dan `inputJadwal` di `AdminDashboard`.
- [ ] Buat `ScheduleList` reusable dan hubungkan query jadwal ke GuruDashboard serta SiswaDashboard.
- [ ] Sediakan state loading, error, kosong, dan fallback demo yang diberi label.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Admin dapat membuat jadwal valid dan jadwal muncul pada daftar mingguan.
- [ ] Admin dapat mengedit, mempublikasikan, dan menghapus jadwal.
- [ ] Bentrok jadwal guru ditolak dengan pesan yang menyebut jadwal bentrok.
- [ ] Bentrok kelas ditolak dengan pesan yang menyebut kelas dan waktu.
- [ ] Guru hanya melihat jadwal yang terhubung ke akun/profilnya.
- [ ] Siswa hanya melihat jadwal berdasarkan kelasnya.
- [ ] Pengguna non-admin tidak dapat menjalankan CRUD admin dan menerima 403.
- [ ] Jadwal tidak dipindahkan ke GitHub JSON dan tidak memuat password/token.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
