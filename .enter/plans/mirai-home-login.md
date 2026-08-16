# Rencana Implementasi Dasbor Home Login MIRAI

## Context
Pengguna ingin membangun halaman home/login berdasarkan desain referensi yang diberikan. Struktur visual yang harus dipertahankan adalah layar pemilihan peran MIRAI: branding dan informasi tim riset di sisi kiri, empat pilihan peran di sisi kanan, latar pastel bertekstur lembut, serta tombol akses/keamanan di sudut kanan bawah. Implementasi akan disesuaikan dengan file kode yang akan dikirimkan pengguna berikutnya.

## Pendekatan yang direkomendasikan
- Meninjau file halaman utama, stylesheet global, konfigurasi Tailwind, serta aset yang tersedia sebelum menyentuh kode.
- Memecah halaman menjadi komponen terfokus: latar dekoratif, blok branding/tim riset, kartu pilihan peran, dan kontrol akses.
- Menggunakan token desain semantik pada `src/index.css` dan kelas Tailwind yang sudah tersedia; tidak menanamkan warna langsung secara tersebar di komponen.
- Menyesuaikan aset logo, foto tim, dan ilustrasi peran dari file yang pengguna kirimkan atau aset proyek yang telah tersedia; tidak membuat data backend palsu.
- Menambahkan interaksi pemilihan peran yang nyata sesuai routing/alur aplikasi yang sudah ada, tanpa mengubah bagian aplikasi di luar kebutuhan halaman home/login.
- Menjaga komposisi desktop seperti referensi, lalu menyediakan responsivitas mobile dengan susunan vertikal yang tetap mempertahankan hierarki informasi.
- Menambahkan animasi masuk bertahap dan state hover/focus yang halus, dengan dukungan keyboard dan kontras yang memadai.

## File kritis yang akan ditinjau/kemungkinan dimodifikasi
- `src/pages/Index.tsx` atau halaman home/login aktif
- `src/App.tsx` dan `src/router.tsx` untuk alur navigasi
- `src/index.css` dan `src/App.css` untuk token, latar, responsivitas, serta animasi
- `tailwind.config.ts` bila diperlukan untuk token atau font
- Direktori aset `public/` atau aset yang akan dikirimkan pengguna
- Komponen UI terkait tombol/kartu bila dapat digunakan kembali

## Implementation checklist
- [ ] Identifikasi entry point home/login dan alur navigasi peran dari file kode yang dikirimkan.
- [ ] Inventarisasi aset logo, foto tim riset, dan ilustrasi empat peran.
- [ ] Implementasikan struktur layout MIRAI dengan area kiri dan kanan yang jelas.
- [ ] Implementasikan latar pastel berlapis beserta elemen dekoratif tanpa mengganggu keterbacaan.
- [ ] Implementasikan kartu Guru, Siswa, Orang Tua, dan Tamu sebagai komponen/data konfigurasi yang dapat dipelihara.
- [ ] Hubungkan aksi kartu peran ke routing atau callback aplikasi yang sudah ada.
- [ ] Tambahkan state hover, focus-visible, selected, dan animasi masuk yang tidak menghalangi aksesibilitas.
- [ ] Pastikan layout tetap usable pada ukuran tablet dan mobile.

## Verification checklist
- [ ] Verifikasi tampilan desktop terhadap referensi: hierarki kiri/kanan, ukuran kartu, jarak, dan nuansa pastel.
- [ ] Verifikasi setiap kartu peran dapat difokuskan dengan keyboard dan memiliki label yang jelas.
- [ ] Verifikasi state awal tanpa peran terpilih tetap tampil benar.
- [ ] Verifikasi klik masing-masing peran menuju target navigasi atau callback yang benar.
- [ ] Verifikasi breakpoint mobile tidak menyebabkan overflow horizontal atau kartu bertumpuk secara tidak terbaca.
- [ ] Verifikasi kontras teks, focus ring, dan alt text aset.
- [ ] Jalankan pemeriksaan lint dan build proyek melalui workflow framework setelah implementasi disetujui.

## Input yang masih diperlukan
Kirimkan file kode halaman home/login beserta aset atau nama file aset yang ingin dipakai. Setelah itu rencana ini akan disesuaikan dengan struktur proyek aktual sebelum implementasi dimulai.
