# Rencana: Perbaikan Login dan Manajemen Admin MIRAI

## Context
Login admin MIRAI sudah memanggil autentikasi email/password dengan format `username@mirai.local`, tetapi akses admin penuh belum lengkap. Pengguna meminta akun admin khusus `hasanhadid` dengan password yang dipilih, serta dasbor yang dapat mengelola seluruh pengguna: reset password, menonaktifkan, menghapus, dan mengubah peran. Password Auth tetap disimpan sebagai hash oleh sistem dan tidak pernah ditampilkan kembali.

## Pendekatan
1. Pertahankan login pada `src/components/AdminLoginModal.tsx`, tetapi tambahkan state sesi global/guard agar halaman `/admin` dan operasi admin tidak hanya bergantung pada navigasi client.
2. Buat satu backend function `admin-user-management` dengan verifikasi JWT server-side dan `app_metadata.role === "admin"`. Function memakai client service-role hanya di server untuk:
   - daftar pengguna tanpa password/hash/token;
   - reset password;
   - aktif/nonaktif akun;
   - hapus akun dengan konfirmasi eksplisit;
   - ubah role yang diizinkan.
3. Tambahkan audit log untuk operasi sensitif dan RLS admin-only pada tabel audit. Tidak ada privilege check yang dipercaya dari client.
4. Ganti/selaraskan panel `src/components/admin/AdminCredentialVault.tsx` menjadi panel manajemen pengguna Auth. Password tidak dapat dipulihkan atau dilihat; form hanya menerima password baru untuk reset dan memakai ikon mata lokal saat mengetik.
5. Tambahkan menu dan UI aksi di `src/pages/AdminDashboard.tsx` dengan status loading/error, konfirmasi sebelum hapus/nonaktifkan, dan perlindungan agar admin terakhir tidak dapat dihapus atau diturunkan perannya.
6. Provision akun awal `hasanhadid@mirai.local` di lingkungan admin tepercaya dengan `app_metadata: { role: "admin" }`; password tidak ditanam di repository, migration, JSON, atau frontend. Jika akun belum ada, langkah provisioning aman harus dijalankan menggunakan jalur Auth admin yang memiliki service-role key.

## File yang dibuat/diubah
- `src/components/AdminLoginModal.tsx`: validasi login dan pesan error.
- `src/pages/AdminDashboard.tsx`: guard sesi admin dan menu manajemen pengguna.
- `src/components/admin/AdminUserManagement.tsx`: daftar pengguna dan aksi reset/nonaktif/hapus/ubah role.
- `supabase/functions/admin-user-management/index.ts`: operasi Auth server-side dan audit.
- Migration melalui `supabase_migration`: tabel `admin_user_audit_logs`, RLS, index, dan policy admin-only.
- `supabase/config.toml`: hanya bila diperlukan konfigurasi backend function.
- File generated `src/integrations/supabase/client.ts` dan `types.ts` tidak diedit manual.

## Batasan keamanan
- Password Auth tidak bisa dibaca kembali; hanya dapat direset.
- Service-role key tidak pernah dikirim ke browser, chat, GitHub, atau file `.env` frontend.
- Semua endpoint manajemen memverifikasi sesi dan role admin di backend.
- User biasa, user anonim, dan admin tanpa role tidak dapat membaca daftar Auth atau menjalankan aksi.
- Penghapusan dan perubahan role admin memakai konfirmasi dan aturan perlindungan admin terakhir.

## Implementation checklist
- [ ] Tambahkan migration audit log dengan RLS aktif pada migration yang membuat tabel dan policy admin-only.
- [ ] Implementasikan backend function `admin-user-management` tanpa raw SQL dan tanpa mengembalikan password/hash/token.
- [ ] Implementasikan aksi list, reset-password, toggle-disabled, delete, dan set-role dengan validasi input.
- [ ] Tambahkan guard sesi yang memuat session dan user melalui `onAuthStateChange` sebelum pemeriksaan sesi awal.
- [ ] Buat panel admin dengan tabel pengguna, filter, indikator status, form reset password, dan konfirmasi aksi destruktif.
- [ ] Hubungkan panel ke backend function melalui `supabase.functions.invoke`.
- [ ] Provision user awal `hasanhadid@mirai.local` melalui jalur Auth admin tepercaya dengan role admin; jangan simpan password di source.
- [ ] Pastikan menu vault lama tidak memberikan kesan password Auth dapat dilihat kembali.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Login valid dengan username `hasanhadid` diarahkan ke `/admin` hanya bila email Auth dan `app_metadata.role` benar.
- [ ] Password salah, email tidak terdaftar, dan role non-admin ditolak tanpa membocorkan detail akun.
- [ ] Admin dapat melihat daftar user tanpa kolom password/hash/token.
- [ ] Admin dapat mereset password dan password baru dapat dipakai login.
- [ ] Admin dapat menonaktifkan/mengaktifkan user dan user nonaktif ditolak saat login.
- [ ] Admin dapat menghapus user dan user terhapus tidak dapat login.
- [ ] Admin dapat mengubah role, tetapi admin terakhir tidak dapat dihapus atau diturunkan.
- [ ] Non-admin mendapat status 403 dari backend function dan tidak dapat membaca audit log.
- [ ] Audit log merekam actor, aksi, target, dan waktu tanpa menyimpan password.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
