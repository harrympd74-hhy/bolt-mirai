# Rencana: Sinkronisasi Manual GitHub → Enter Cloud

## Context
GitHub `harrympd74-hhy/bolt-mirai` menjadi sumber utama data. Pengguna memilih format hybrid: data mentah disimpan dalam JSON terpisah di repository, kemudian divalidasi dengan Zod sebelum masuk Enter Cloud. Sinkronisasi dilakukan manual dari tombol Admin terlebih dahulu.

Repository saat ini berisi source code dan schema, sehingga konektor tidak akan menebak semua file TypeScript sebagai data. Konektor memakai kontrak file JSON eksplisit:
- `data/students.json`
- `data/teachers.json`
- `data/classes.json`
- `data/schedules.json`

## Pendekatan
1. Tambahkan schema Zod di backend function untuk memvalidasi bentuk data sebelum mutation.
2. Buat tabel `sync_runs` untuk log status, commit SHA, jumlah record, error, dan waktu sinkronisasi; aktifkan RLS.
3. Buat backend function `github-sync`:
   - hanya bisa dipanggil admin terautentikasi;
   - membaca branch `main` melalui GitHub Contents API;
   - memakai `GITHUB_TOKEN` jika repository private, tanpa menaruh token di client;
   - mengambil file JSON yang disepakati;
   - memvalidasi setiap dataset dengan Zod;
   - melakukan upsert ke `student_profiles`, `teacher_profiles`, dan tabel data tambahan yang tersedia;
   - menulis log `sync_runs` dan mengembalikan ringkasan.
4. Tambahkan tombol **Sinkronkan dari GitHub** di Dasbor Admin, area status sinkronisasi terakhir, jumlah record, commit, loading, error, dan hasil berhasil.
5. Tambahkan contoh kontrak JSON di repository MIRAI agar pengguna bisa menyalin format yang benar; data sensitif/password tidak boleh masuk JSON GitHub.

## Batasan keamanan
- Password akun, API key, token, dan file `.env` dilarang berada di GitHub JSON.
- RLS membatasi log sinkronisasi hanya admin.
- Kontrol admin dilakukan di backend berdasarkan role authentication, bukan hanya tombol client.
- Sinkronisasi manual dulu; jadwal harian belum diaktifkan sampai alur manual tervalidasi.

## File yang dibuat/diubah
- Migration Enter Cloud melalui `supabase_migration`: tabel `sync_runs` + RLS.
- `supabase/functions/github-sync/index.ts`: fetch GitHub, Zod validation, upsert, log.
- `src/components/admin/GitHubSync.tsx`: tombol dan status sync.
- `src/pages/AdminDashboard.tsx`: tambahkan panel/akses sinkronisasi tanpa mengubah menu yang ada.
- Kontrak JSON `data/*.json` di repository bila pengguna menyetujui seed template.
- `supabase/config.toml` hanya jika konfigurasi function diperlukan.

## Implementation checklist
- [ ] Buat migration tabel `sync_runs` dengan RLS dan policy admin.
- [ ] Verifikasi schema/RLS setelah migration.
- [ ] Implementasikan backend function `github-sync` dengan fetch GitHub, branch `main`, validasi Zod, upsert, dan logging.
- [ ] Pastikan `GITHUB_TOKEN` dibaca dari secret backend jika repository private.
- [ ] Deploy dan verifikasi backend function.
- [ ] Buat komponen Admin `GitHubSync` dengan tombol manual, status, commit, jumlah record, loading, dan error.
- [ ] Integrasikan komponen ke Dasbor Admin.
- [ ] Tambahkan kontrak JSON tanpa password/token/data sensitif.
- [ ] Uji dataset valid, dataset invalid, file hilang, dan repository gagal diakses.

## Verification checklist
- [ ] Admin dapat menekan Sinkronkan dari GitHub dan melihat hasil ringkasan.
- [ ] Commit SHA yang diproses tercatat di `sync_runs`.
- [ ] Data valid masuk/upsert ke tabel target tanpa duplikasi.
- [ ] JSON invalid ditolak sebelum mutation dan error tercatat.
- [ ] File yang tidak tersedia menghasilkan status gagal yang jelas.
- [ ] Non-admin tidak dapat menjalankan atau membaca log sinkronisasi.
- [ ] Tidak ada secret/password dalam response, client code, atau JSON contoh.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
