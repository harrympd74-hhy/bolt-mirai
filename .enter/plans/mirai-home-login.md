# Rencana Implementasi Dasbor Home Login MIRAI

## Context
Pengguna ingin mengganti halaman awal template menjadi home/login MIRAI berdasarkan desain referensi: branding dan informasi tim riset di kiri, empat pilihan peran di kanan, latar pastel bertekstur lembut, serta akses admin di sudut kanan bawah. Pengguna telah memberikan implementasi `HomeLogin` sebagai acuan perilaku dan visual. Scope saat ini hanya tampilan serta interaksi home/login; dashboard/rute `/guru` dan `/siswa` tidak dibuat pada tahap ini. Validasi username/password tetap memakai kredensial demo lokal untuk sementara.

## Pendekatan yang direkomendasikan
- Mengganti isi `src/pages/Index.tsx` dengan halaman MIRAI yang mengadopsi struktur `HomeLogin` yang dikirim pengguna.
- Mempertahankan aset publik URL yang sudah ditentukan pengguna untuk logo, tim riset, dan ilustrasi peran, dengan `alt` text serta `crossOrigin` pada gambar eksternal.
- Menjadikan daftar peran sebagai konfigurasi terstruktur agar kartu Guru, Siswa, Orang Tua, dan Tamu konsisten serta mudah dirawat.
- Mempertahankan modal login peran, toggle visibilitas password, checkbox ingat saya, state loading, dan pesan error demo lokal dari kode acuan.
- Tidak membuat dashboard atau rute baru. Jika navigasi demo berhasil menuju rute yang belum tersedia, perilaku tersebut akan dicatat/ditangani secara minimal tanpa memperluas scope halaman.
- Karena `AdminLoginModal` belum ditemukan di proyek, menambahkan implementasi modal admin minimal hanya bila tombol admin tetap dipertahankan; komponen ini tidak akan membuat dashboard admin.
- Memindahkan dekorasi latar dan gaya berulang ke token/stylesheet global seperlunya, sambil menghindari perubahan pada komponen UI shadcn yang tidak terkait.
- Menambahkan aksesibilitas dasar: kartu peran dapat diakses keyboard, tombol memiliki label, modal dapat ditutup, input memiliki label, dan animasi menghormati `prefers-reduced-motion` bila diperlukan.
- Menjaga responsivitas: komposisi dua kolom pada desktop dan susunan vertikal pada layar kecil tanpa overflow horizontal.

## File kritis yang ditinjau dan kemungkinan dimodifikasi
- `src/pages/Index.tsx`: entry point yang saat ini masih berupa template sederhana; menjadi halaman MIRAI.
- `src/index.css`: token dasar, reset, dan aturan global bila diperlukan untuk tampilan pastel.
- `src/App.css`: aturan template lama akan dibersihkan atau disesuaikan agar tidak membatasi `#root` pada lebar 1280px.
- `src/components/AdminLoginModal.tsx`: dibuat hanya jika tombol admin dipertahankan dan komponen memang belum tersedia.
- `src/router.tsx`: tidak menambah rute dashboard pada scope ini; hanya diperiksa untuk memastikan halaman home tetap menjadi `/`.
- `package.json`: tidak menambah dependency karena `framer-motion` dan `lucide-react` sudah tersedia.

## Implementation checklist
- [x] Ganti template `Index` menjadi halaman home/login MIRAI dengan pembagian layout kiri/kanan.
- [x] Tambahkan latar gradient mesh, grid lembut, lingkaran dekoratif, dan titik animasi sesuai referensi.
- [x] Tambahkan logo, judul MIRAI, tagline, dan blok empat anggota tim riset menggunakan aset yang diberikan.
- [x] Tambahkan empat kartu peran dengan konfigurasi judul, deskripsi, warna aksen, gambar, dan role key.
- [x] Tambahkan modal login peran dengan kredensial demo lokal yang dipertahankan dari kode acuan.
- [x] Tambahkan toggle password, loading, error login, penutupan modal, dan navigasi demo yang sudah ada tanpa membuat dashboard baru.
- [x] Tambahkan modal admin minimal; jangan menambahkan rute admin.
- [x] Hilangkan batasan CSS template yang menyebabkan `#root` tidak memenuhi viewport.
- [x] Pastikan interaksi kartu peran, modal, dan tombol admin dapat digunakan dengan keyboard.
- [x] Pastikan layout desktop, tablet, dan mobile tidak mengalami overflow horizontal.

## Verification checklist
- [ ] Verifikasi state awal `/` menampilkan seluruh branding, tim riset, empat peran, latar, dan tombol admin.
- [ ] Verifikasi klik dan keyboard activation pada masing-masing kartu membuka modal dengan role yang benar.
- [ ] Verifikasi submit dengan kredensial demo benar/salah menampilkan loading dan pesan error yang sesuai.
- [ ] Verifikasi toggle password, tombol tutup, klik backdrop, dan tombol lupa password tidak menyebabkan crash.
- [ ] Verifikasi tombol Guru/Siswa tidak mengharuskan dashboard baru dibuat dalam scope ini dan tidak merusak halaman home.
- [ ] Verifikasi tombol admin membuka/menutup modal minimal bila komponen tersebut diimplementasikan.
- [ ] Verifikasi gambar memiliki alt text, kontrol memiliki label, dan focus-visible terlihat.
- [ ] Verifikasi breakpoint mobile tidak memotong nama, kartu, modal, atau menyebabkan scroll horizontal.
- [ ] Jalankan lint dan build melalui workflow framework setelah implementasi disetujui.
