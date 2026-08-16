# Rencana Integrasi Dashboard Guru SMP Kelas 7

## Context
Pengguna ingin membangun dashboard guru MIRAI berdasarkan komponen yang telah dikirimkan. Data profil yang diberikan adalah Guru Demo, guru Matematika di SMPN 1 Bandung. Pengguna menetapkan bahwa seluruh data dan konteks awal harus fokus pada SMP kelas 7, sehingga jadwal, shortcut, placeholder, dan informasi beranda tidak boleh menampilkan kelas VIII/IX.

## Pendekatan yang direkomendasikan
- Menambahkan route `/guru` yang merender shell `GuruDashboard` tanpa mengubah route home `/` dan admin `/admin`.
- Menambahkan data profil guru ke `src/data/guruData.ts`, menggunakan `defaultProfileData` yang diberikan dan nilai kelas mengajar yang terbatas pada VII-A/VII-B/VII-C.
- Menambahkan konfigurasi navigasi guru dari `navConfig.ts`; struktur menu tetap dapat memuat fitur yang belum dibangun, tetapi label/placeholder akan menunjukkan fitur dalam pengembangan.
- Menambahkan komponen shell responsif: `Sidebar`, `Topbar`, `MobileDrawer`, dan `MobileBottomNav`, termasuk collapse sidebar desktop dan navigasi mobile.
- Menggunakan `Beranda.tsx` yang sudah disesuaikan agar jadwal hanya VII-A, VII-B, VII-C, serta shortcut berorientasi kelas 7.
- Menambahkan `ProfilGuru.tsx` untuk identitas, kepegawaian, pendidikan, data mengajar, dan sertifikasi dengan state frontend lokal.
- Menambahkan `PlaceholderPage.tsx` untuk menu lain agar klik navigasi bekerja tanpa membuat fitur yang belum diminta.
- Menambahkan token tema guru (`--mirai-*`) yang diperlukan komponen dan memakai token semantik yang sudah ada untuk warna tosca–kuning–coklat.
- Tidak menambahkan backend, autentikasi baru, atau database; dashboard guru tahap ini adalah UI/state lokal.

## File kritis yang akan dibuat/dimodifikasi
- `src/pages/GuruDashboard.tsx`
- `src/pages/guru/Beranda.tsx` (sudah ada dan dipertahankan dengan fokus kelas 7)
- `src/pages/guru/ProfilGuru.tsx`
- `src/pages/guru/PlaceholderPage.tsx`
- `src/components/guru/Sidebar.tsx`
- `src/components/guru/Topbar.tsx`
- `src/components/guru/MobileDrawer.tsx`
- `src/components/guru/MobileBottomNav.tsx`
- `src/components/guru/navConfig.ts`
- `src/data/guruData.ts`
- `src/router.tsx`
- `src/index.css` dan/atau `src/App.css` untuk token tema guru

## Implementation checklist
- [ ] Tambahkan `guruData.ts` dengan `ProfileData`, `defaultProfileData`, dan kelas mengajar hanya VII-A/VII-B/VII-C.
- [ ] Tambahkan `navConfig.ts` beserta breadcrumb dan mobile bottom items.
- [ ] Tambahkan `Sidebar` dengan collapse desktop, section labels, active state, dan navigasi keyboard.
- [ ] Tambahkan `Topbar` dengan breadcrumb, toggle sidebar, dan akses Profil Guru.
- [ ] Tambahkan `MobileDrawer` dan `MobileBottomNav` untuk breakpoint mobile.
- [ ] Tambahkan `PlaceholderPage` untuk menu guru yang belum dibangun.
- [ ] Tambahkan `ProfilGuru` dengan tab profil dan edit/simpan/batal state lokal.
- [ ] Tambahkan `GuruDashboard` dengan active navigation, localStorage collapse state, footer profil, dan cleanup responsive drawer.
- [ ] Tambahkan route `/guru` ke router sebelum catch-all.
- [ ] Tambahkan token `--mirai-background`, `--mirai-sidebar`, `--mirai-accent`, `--mirai-cosmic`, `--mirai-mist`, dan `--mirai-success` bila belum tersedia.
- [ ] Pastikan `Beranda` tetap hanya menampilkan jadwal dan shortcut kelas 7 SMP.

## Verification checklist
- [ ] Verifikasi `/guru` merender Beranda tanpa import error.
- [ ] Verifikasi sidebar menampilkan menu dan section pada desktop serta collapse/expand bekerja.
- [ ] Verifikasi drawer dan bottom navigation bekerja pada mobile.
- [ ] Verifikasi Beranda hanya menampilkan VII-A, VII-B, VII-C dan tidak menampilkan VIII/IX.
- [ ] Verifikasi Profil Guru dapat dibuka dari topbar dan edit/simpan/batal berjalan di state lokal.
- [ ] Verifikasi semua menu lain membuka placeholder tanpa crash.
- [ ] Verifikasi reload mempertahankan state collapse sidebar melalui localStorage.
- [ ] Verifikasi footer menampilkan nama, kode guru, mata pelajaran, dan unit kerja dari `defaultProfileData`.
- [ ] Verifikasi layout tidak mengalami overflow pada desktop dan mobile.
- [ ] Jalankan lint dan build proyek melalui workflow framework setelah implementasi.
