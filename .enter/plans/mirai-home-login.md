# Rencana: Beranda Dasbor Murid dengan Latar Alam

## Context
Beranda dasbor murid perlu dibuat sederhana, interaktif, dan menarik. Pengguna meminta gambar alam sebagai latar, tetapi informasi utama seperti sapaan, jadwal, tugas, progres, dan Problem Struggle harus tetap mudah dibaca.

## Pendekatan
1. Pertahankan komponen data dan navigasi murid yang sudah ada.
2. Ubah `StudentHome` menjadi layout berlapis: gambar alam dengan overlay transparan, lalu konten utama dalam card terang agar kontras tetap aman.
3. Tambahkan interaksi ringan pada kartu kelas, tugas, materi, jadwal, dan Problem Struggle tanpa mengubah alur ruang kelas.
4. Gunakan gambar alam publik dengan overlay/blur ringan agar gambar tidak mengganggu data dan tetap responsif pada mobile.

## File yang diubah
- `src/pages/SiswaDashboard.tsx`: beranda murid, background alam, overlay, card interaktif.
- `src/components/student/StruggleCard.tsx`: penyesuaian visual bila diperlukan.

## Implementation checklist
- [ ] Tambahkan background gambar alam pada area beranda murid.
- [ ] Tambahkan overlay lembut dan panel konten terang untuk menjaga keterbacaan.
- [ ] Rapikan hero Halo, statistik, jadwal, tugas, materi, kelompok, dan Problem Struggle.
- [ ] Tambahkan hover/focus state ringan pada kartu dan CTA.
- [ ] Pastikan background tidak muncul pada layar ruang kelas/tutor.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Beranda murid menampilkan gambar alam yang tidak menutupi teks.
- [ ] Jadwal, tugas, progres, dan Problem Struggle terbaca pada desktop dan mobile.
- [ ] Kartu memiliki CTA/interaksi yang berfungsi.
- [ ] Kontras warna tetap nyaman dan overlay tidak terlalu gelap.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
