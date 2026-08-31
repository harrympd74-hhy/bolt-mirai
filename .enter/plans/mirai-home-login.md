# Rencana: Admin — Input Guru + Akun Login

## Context
Pengguna ingin form **Input Guru** Dasbor Admin mengikuti referensi: pilihan jenis kepegawaian **Guru Tetap, Guru Honor, Guru Magang**, data pribadi/kepegawaian, serta pembuatan username dan password oleh admin. Fitur akun berlaku sama untuk ketiga jenis guru.

Password mengikuti aturan keamanan yang sudah disepakati untuk siswa: **masked setelah dibuat, tidak disimpan plaintext, dan tersedia reset password**.

## Pendekatan
- Pertahankan `GuruRecord` dan struktur jenis guru yang sudah ada.
- Tambahkan akun guru sebagai relasi backend terpisah, bukan kolom password pada profil guru.
- Gunakan pola `student_accounts` yang sudah dibuat: `teacher_accounts` menyimpan username, tipe akun, auth user id, dan timestamp reset terakhir; password dikelola authentication backend.
- UI input mengikuti referensi dengan panel `Akun Login Guru` di bawah data kepegawaian.
- Daftar Guru Tetap/Honor/Magang menampilkan username dan status password masked, plus aksi reset.
- Admin authentication backend menjadi prasyarat untuk mutation production; login admin saat ini masih demo/hardcoded sehingga tidak boleh dijadikan kontrol akses database.

## Backend & Database
1. Migration Enter Cloud:
   - Tambah `teacher_accounts` dengan `teacher_id`, `account_type = 'teacher'`, `username` unique, `auth_user_id`, `last_password_reset_at`, timestamps.
   - Foreign key ke profil guru yang persisten. Karena profil guru saat ini masih in-memory, tambahkan tabel `teacher_profiles` yang memuat `kode_guru`, `jenis_guru`, field data pribadi/kepegawaian utama, status, timestamps.
   - Unique constraint `kode_guru`, serta index jenis/nama.
   - Aktifkan RLS pada kedua tabel dalam migration yang sama.
   - Policy admin untuk CRUD berdasarkan `auth.jwt() -> app_metadata ->> 'role' = 'admin'`; policy guru untuk membaca profil/akun yang terhubung dengan `auth.uid()`.
2. Backend function `admin-teacher-accounts`:
   - action `create`: membuat auth user guru dan relasi account, mengembalikan username/status/kode saja.
   - action `reset-password`: mereset password tanpa mengembalikan plaintext.
   - action `delete`: menghapus relasi/profil sesuai aturan.
   - Validasi role admin di backend, bukan client.
3. Verifikasi schema dan RLS setelah migration.

## UI
- `src/components/admin/InputGuru.tsx`:
  - Pertahankan tiga tab jenis kepegawaian dan seluruh field referensi.
  - Tambahkan panel `Akun Login Guru`: username, password awal, konfirmasi password, indikator password, dan catatan bahwa password selanjutnya masked.
  - Validasi nama, jenis guru, username, password, konfirmasi password.
  - Simpan profil + akun melalui backend; tampilkan halaman berhasil dengan username dan tombol reset/lihat daftar.
- `src/components/admin/DataGuruList.tsx`:
  - Tambahkan kolom username guru dan status password masked.
  - Tambahkan aksi reset password dengan dialog konfirmasi.
  - Tetap pisahkan filter Guru Tetap/Honor/Magang.
- `src/data/guruStore.ts`:
  - Tambahkan field akun non-sensitif untuk kompatibilitas UI sementara, lalu arahkan sumber data admin ke query backend setelah auth admin tersedia.
- `src/pages/AdminDashboard.tsx`:
  - Pertahankan navigasi Input Guru untuk ketiga jenis; pastikan callback kembali ke daftar jenis yang benar.

## File penting
- `src/components/admin/InputGuru.tsx`
- `src/components/admin/DataGuruList.tsx`
- `src/data/guruStore.ts`
- `src/pages/AdminDashboard.tsx`
- Migration Enter Cloud melalui `supabase_migration`
- `supabase/functions/admin-teacher-accounts/index.ts`

## Implementation checklist
- [ ] Buat `teacher_profiles` dan `teacher_accounts` dengan foreign key, unique constraint, index, RLS, dan policy role-aware.
- [ ] Buat backend function create/reset/delete akun guru tanpa mengembalikan password.
- [ ] Verifikasi schema dan daftar RLS policy Enter Cloud.
- [ ] Tambahkan panel akun guru pada form Input Guru sesuai referensi.
- [ ] Terapkan validasi password dan konfirmasi password tanpa menyimpan plaintext.
- [ ] Tambahkan username/status masked dan aksi reset pada daftar guru Tetap/Honor/Magang.
- [ ] Hubungkan callback Input Guru dan daftar guru untuk ketiga jenis.
- [ ] Pastikan admin authentication backend menjadi kontrol akses sebelum CRUD production.

## Verification checklist
- [ ] Form dapat berpindah antara Guru Tetap, Honor, dan Magang tanpa kehilangan struktur data.
- [ ] Field data pribadi/kepegawaian dan panel akun guru tampil sesuai referensi.
- [ ] Password tidak pernah tampil plaintext setelah penyimpanan; reset membutuhkan konfirmasi.
- [ ] Username unik dan akun tertaut ke profil guru yang benar.
- [ ] Daftar masing-masing jenis guru menampilkan username dan status masked.
- [ ] Pengguna non-admin tidak dapat CRUD data guru melalui RLS/backend function.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
