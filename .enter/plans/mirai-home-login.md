# Rencana: Admin — Data Siswa + Akun Siswa/Orang Tua

## Context
Pengguna ingin menu **Data Siswa** pada Dasbor Admin dibangun mengikuti dua referensi gambar:
1. Daftar siswa dengan pencarian, jumlah siswa, tombol sembunyikan password, input data, tabel horizontal, status, edit, dan hapus.
2. Form Input Data Siswa dengan identitas siswa, kelas, jenis kelamin, kontak wali, akun login siswa, dan akun login orang tua.

Data akan dipakai lintas dasbor sehingga tidak lagi menggunakan `siswaStore.ts` in-memory. Password mengikuti keputusan pengguna: **masked di tabel dan tidak disimpan sebagai plaintext; tersedia fitur reset**.

## Keputusan keamanan
- Data siswa disimpan di Enter Cloud Database.
- Password tidak disimpan di tabel siswa dan tidak pernah dikirim ke client dalam plaintext.
- Akun siswa/orang tua dikelola melalui authentication backend; admin hanya menerima username/status dan aksi reset password.
- Akses admin tidak boleh ditentukan di client. Karena login admin saat ini masih hardcoded/demo di `Index.tsx`, implementasi production perlu memindahkan autentikasi admin ke backend sebelum CRUD dibuka penuh.
- Setiap tabel baru dibuat melalui migration dengan RLS dan policy yang membatasi admin.

## Tahap implementasi yang direkomendasikan
### 1. Backend & schema
- Buat tabel `student_profiles`: `id`, `nis`, `nisn`, `full_name`, `class_name`, `gender`, `guardian_email`, `guardian_phone`, `status`, `created_at`, `updated_at`.
- Buat tabel `student_accounts`: `student_id`, `account_type` (`student`/`parent`), `username`, `auth_user_id`, `last_password_reset_at`, `created_at`, `updated_at`.
- Tambahkan unique index untuk NIS/NISN dan kombinasi tipe akun/username.
- Aktifkan RLS pada kedua tabel di migration yang sama. Policy membaca/menulis hanya untuk role admin yang sudah terautentikasi; siswa/orang tua hanya membaca profil yang terhubung dengan akun masing-masing.
- Buat backend function `admin-student-accounts` untuk membuat akun auth, membuat/reset password, dan mengembalikan hanya status akun (bukan password).
- Buat/upgrade alur autentikasi admin agar policy dapat mengenali role admin; jangan menggunakan password hardcoded dari `Index.tsx` untuk akses production.
- Jalankan pemeriksaan schema/RLS setelah migration.

### 2. UI daftar siswa
- Rework `src/components/admin/DataSiswaList.tsx` mengikuti gambar: header `Daftar Siswa`, jumlah siswa, tombol `Sembunyikan Sandi`, tombol `Input Data Siswa`, search nama/NIS/kelas, tabel overflow horizontal.
- Kolom: NIS, Nama, Kelas, L/P, Kontak, User Siswa, Sandi Siswa (masked), User Ortu, Sandi Ortu (masked), Status, Aksi.
- Sandi selalu berupa bullet/masked; tombol reset membuka konfirmasi dan memanggil backend function.
- Tambahkan state loading, empty state, error state, dan refresh setelah create/edit/delete/reset.
- Pertahankan pola ikon lucide dan token warna admin yang sudah ada.

### 3. UI form input siswa
- Rework `src/components/admin/InputSiswa.tsx` mengikuti gambar: tombol kembali, identitas siswa, kelas, jenis kelamin, email wali, nomor telepon wali, panel akun login siswa, panel akun login orang tua, tombol Simpan/Batal.
- Validasi field wajib: NIS, nama lengkap, kelas, username/password awal siswa, username/password awal orang tua.
- Password hanya dikirim sekali ke backend function saat pembuatan akun dan tidak dikembalikan ke browser setelah tersimpan.
- Setelah berhasil, kembali ke daftar siswa dan menampilkan notifikasi sukses.

### 4. Integrasi admin dashboard
- Ganti `src/data/siswaStore.ts` sebagai sumber data daftar admin dengan query backend; store demo tidak lagi dipakai untuk route admin.
- Pertahankan `AdminDashboard.tsx` menu `Daftar Siswa` dan `Input Siswa`, hanya ubah callback/state agar refresh berbasis data server.
- Pastikan pencarian, edit, hapus, reset password, dan create menggunakan backend/database.

## File penting
- `src/components/admin/DataSiswaList.tsx`
- `src/components/admin/InputSiswa.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/data/siswaStore.ts` (deprecate untuk admin setelah query backend aktif)
- `src/pages/Index.tsx` (alur login admin perlu dinaikkan ke authentication backend)
- Migration Enter Cloud melalui `supabase_migration` (bukan edit file SQL manual)
- `supabase/functions/admin-student-accounts/index.ts`

## Implementation checklist
- [ ] Konfirmasi/terapkan model password masked + reset tanpa plaintext.
- [ ] Buat migration `student_profiles` + `student_accounts` dengan unique constraints, foreign key, RLS, dan policy role-aware.
- [ ] Buat backend function akun siswa/orang tua untuk create/reset/status; tidak mengembalikan password.
- [ ] Hubungkan authentication admin ke role admin sebelum policy CRUD production digunakan.
- [ ] Verifikasi schema dan RLS dengan pemeriksaan metadata Enter Cloud.
- [ ] Rework `DataSiswaList.tsx` sesuai referensi dengan kolom akun masked, search, status, aksi edit/hapus/reset.
- [ ] Rework `InputSiswa.tsx` sesuai referensi dengan dua panel akun login.
- [ ] Hubungkan daftar/form ke query backend dan refresh setelah mutation.
- [ ] Pertahankan fallback empty/error/loading yang jelas tanpa memalsukan data server.

## Verification checklist
- [ ] Admin dapat membuka Daftar Siswa dan melihat data dari database, bukan array in-memory.
- [ ] Search berdasarkan nama, NIS, atau kelas menghasilkan data yang sesuai.
- [ ] Input siswa baru membuat profil + dua akun; password tidak muncul kembali sebagai plaintext.
- [ ] Tombol sembunyikan sandi selalu menjaga password masked; reset password hanya melalui konfirmasi/backend.
- [ ] Edit dan hapus memperbarui database serta daftar tanpa refresh halaman.
- [ ] Pengguna non-admin tidak dapat membaca atau menulis seluruh data siswa melalui policy.
- [ ] Empty state dan error state tampil ketika data kosong atau request gagal.
- [ ] Desktop mengikuti komposisi referensi; tabel tetap bisa di-scroll horizontal pada lebar sempit.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
