# Rencana Integrasi Dashboard Login Admin MIRAI

## Context
Pengguna memberikan implementasi lengkap dashboard admin MIRAI beserta halaman daftar/input guru dan siswa, store data demo in-memory, serta komponen field input. Proyek saat ini baru memiliki halaman home/login MIRAI; route admin, komponen CRUD, store, dan opsi select belum tersedia. Target tahap ini adalah membuat login admin demo lokal yang membuka dashboard admin, tanpa database/backend.

## Pendekatan yang direkomendasikan
- Menambahkan route `/admin` yang merender `AdminDashboard`, sementara halaman `/` home MIRAI tetap dipertahankan.
- Mengubah `AdminLoginModal` dari sekadar alert menjadi login demo lokal yang memvalidasi kredensial admin, menampilkan error/loading, lalu menavigasi ke `/admin` saat berhasil.
- Menambahkan `AdminDashboard.tsx` berdasarkan kode dashboard yang diberikan, termasuk sidebar responsif, pencarian, dark mode, notifikasi, navigasi halaman, statistik, aktivitas, dan kehadiran kelas.
- Menambahkan komponen data yang diberikan pengguna ke `src/components/admin/`: `DataGuruList`, `InputGuru`, `DataSiswaList`, `InputSiswa`, `FieldInput`, serta `selectOpts` yang dirujuk oleh `FieldInput` namun belum dikirim/tersedia.
- Menambahkan store demo lokal ke `src/data/guruStore.ts` dan `src/data/siswaStore.ts`, menggunakan data awal serta fungsi CRUD yang diberikan pengguna. Data hanya hidup selama sesi browser dan tidak dianggap sebagai persistence backend.
- Menambahkan token warna admin (`--guru-*`) ke stylesheet global agar seluruh kelas dashboard yang diberikan memiliki warna valid dan tetap konsisten dengan design system semantik.
- Memisahkan dashboard sebagai halaman fokus aplikasi; tombol keluar mengembalikan pengguna ke `/` tanpa membuat autentikasi server.
- Tidak membuat database, backend function, atau Enter Cloud pada tahap ini karena pengguna memilih dashboard demo lokal dengan state frontend.

## File yang akan dibuat/dimodifikasi
- `src/pages/AdminDashboard.tsx`: dashboard admin utama dari kode pengguna.
- `src/components/admin/DataGuruList.tsx`: daftar/detail/edit/hapus guru.
- `src/components/admin/InputGuru.tsx`: form input guru.
- `src/components/admin/DataSiswaList.tsx`: daftar/detail/edit/hapus siswa.
- `src/components/admin/InputSiswa.tsx`: form input siswa.
- `src/components/admin/FieldInput.tsx`: field input reusable.
- `src/components/admin/selectOpts.ts`: opsi select yang dibutuhkan oleh `FieldInput`.
- `src/data/guruStore.ts`: tipe, seed demo, dan CRUD guru.
- `src/data/siswaStore.ts`: tipe, seed demo, dan CRUD siswa.
- `src/components/AdminLoginModal.tsx`: validasi demo dan navigasi ke `/admin`.
- `src/router.tsx`: route `/admin` sebelum catch-all.
- `src/index.css`: token warna dashboard `--guru-*` dan penyesuaian global yang diperlukan.
- `src/App.css`: style utilitas dashboard seperti `.glass`, bila dibutuhkan oleh kode yang diberikan.

## Implementation checklist
- [x] Tambahkan `guruStore` dengan tipe `GuruRecord`, seed data, label/badge, dan seluruh helper CRUD yang dirujuk komponen.
- [x] Tambahkan `siswaStore` dengan tipe `SiswaRecord`, opsi kelas/status/hubungan wali, seed data, dan helper CRUD.
- [x] Tambahkan `selectOpts` dengan opsi yang sesuai untuk field guru dan siswa.
- [x] Tambahkan `FieldInput` module-level dengan dukungan input dan select.
- [x] Tambahkan `DataGuruList` dan pastikan detail, edit, reset, simpan, hapus, serta pencarian memanggil store yang benar.
- [x] Tambahkan `DataSiswaList` dan pastikan detail, edit, reset, simpan, hapus, serta pencarian memanggil store yang benar.
- [x] Tambahkan `InputGuru` dengan validasi nama, pembuatan kode otomatis, dan callback ke daftar jenis guru.
- [x] Tambahkan `InputSiswa` dengan validasi nama/kelas, pembuatan kode otomatis, dan callback ke daftar siswa.
- [x] Tambahkan `AdminDashboard` dengan sidebar, submenu, dashboard home, placeholder halaman non-CRUD, dan state responsif.
- [x] Tambahkan route `/admin` di `src/router.tsx` tanpa menghapus route `/`.
- [x] Ubah `AdminLoginModal` agar kredensial demo admin mengarahkan ke `/admin`, sedangkan kredensial salah menampilkan error.
- [x] Tambahkan token warna dashboard dan style `.glass`/admin visual.
- [x] Pastikan mode gelap dikembalikan bersih ketika dashboard unmount atau kembali ke home.

## Verification checklist
- [x] Verifikasi `/admin` dapat merender dashboard dan kartu statistik.
- [ ] Verifikasi `/` tetap menampilkan home MIRAI dan tombol admin membuka modal.
- [ ] Verifikasi submit admin dengan kredensial kosong/salah tidak berpindah route dan menampilkan pesan error.
- [ ] Verifikasi login admin berhasil membuka `/admin` melalui modal.
- [ ] Verifikasi sidebar desktop, drawer mobile, submenu Guru/Siswa, dan tombol tutup bekerja.
- [ ] Verifikasi pencarian global memfilter daftar guru dan siswa.
- [ ] Verifikasi tambah, edit, detail, dan hapus guru memperbarui tampilan sesi berjalan.
- [ ] Verifikasi tambah, edit, detail, dan hapus siswa memperbarui tampilan sesi berjalan.
- [ ] Verifikasi mode gelap mengubah tema dashboard dan cleanup saat meninggalkan `/admin`.
- [ ] Verifikasi route tidak dikenal tetap diarahkan ke halaman 404.
- [ ] Verifikasi breakpoint mobile tidak menyebabkan sidebar, tabel, modal, atau form overflow.
- [ ] Jalankan lint dan build proyek melalui workflow framework setelah implementasi.
