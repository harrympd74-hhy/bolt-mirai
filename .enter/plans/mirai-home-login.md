# Rencana Tampilan Ruang Belajar Siswa Kelas 7

## Context
Pengguna memberikan referensi UI ruang belajar dengan layout dua panel: materi guru di kiri dan AI Tutor MIRAI di kanan, plus header progres level, urutan belajar, waktu sesi, dan footer progres. Layout yang sama harus digunakan untuk Kelompok Penjelajah maupun Pengintai. Fokus materi yang digunakan saat ini adalah **Jenis-Jenis Garis**, tetap dalam konteks SMP kelas 7.

## Pendekatan yang direkomendasikan
- Membuat halaman ruang belajar baru `src/pages/siswa/RuangBelajar.tsx` dengan layout responsif dua kolom yang mengikuti referensi.
- Memakai top header berisi breadcrumb Kelas/Sesi Aktif, status berlangsung, judul **Jenis-Jenis Garis**, subtopik, level siswa, urutan materi, dan timer sesi demo.
- Panel kiri “Materi Guru” berisi tab Ringkasan, Dokumen, Video, Presentasi; tab Ringkasan aktif menampilkan konsep garis sejajar, berpotongan, tegak lurus, dan transversal, serta diagram garis berbasis SVG/CSS.
- Panel kiri juga menampilkan kartu “Ciri-ciri” dan “Konsep Penting”, serta daftar sumber materi demo dengan tombol buka/putar non-backend.
- Panel kanan “AI Tutor MIRAI” berisi chat demo, quick prompts topik Jenis-Jenis Garis, respons penjelasan, dan input pesan visual; belum terhubung AI backend.
- Footer menampilkan level, progres XP, target hari ini, dan tombol daftar semua level.
- Menjaga tampilan identik untuk kedua kelompok; label kelompok hanya ditampilkan sebagai badge kecil bila data kelompok tersedia, tidak mengubah layout atau materi.
- Menghubungkan halaman ini dari hasil/ruang kelas siswa dengan topik Jenis-Jenis Garis tanpa menghapus kuis dan AI Tutor demo yang sudah ada.

## File kritis
- `src/pages/siswa/RuangBelajar.tsx`: halaman dua panel baru.
- `src/pages/SiswaDashboard.tsx`: state route internal untuk membuka ruang belajar.
- `src/pages/siswa/RuangKelasAktif.tsx`: tombol lanjutan menuju ruang belajar setelah hasil kuis.
- `src/data/siswaDashboardData.ts`: identitas siswa, kelas VII-A, dan progres demo.

## Implementation checklist
- [ ] Tambahkan header sesi aktif dengan judul Jenis-Jenis Garis dan status berlangsung.
- [ ] Tambahkan panel materi guru dengan tab ringkasan/dokumen/video/presentasi.
- [ ] Tambahkan diagram visual empat jenis garis menggunakan SVG/CSS tanpa gambar eksternal.
- [ ] Tambahkan kartu ciri-ciri dan konsep penting dengan istilah kelas 7.
- [ ] Tambahkan daftar sumber materi demo dan tombol aksi lokal.
- [ ] Tambahkan panel AI Tutor dengan quick prompts serta chat demo yang dapat menambah pesan lokal.
- [ ] Tambahkan footer progres level, XP, target harian, dan daftar level.
- [ ] Pastikan layout sama untuk Penjelajah dan Pengintai.
- [ ] Hubungkan tombol materi/hasil kelas aktif ke halaman ruang belajar topik Jenis-Jenis Garis.
- [ ] Pastikan responsive mobile berubah menjadi susunan vertikal tanpa overflow.

## Verification checklist
- [ ] Verifikasi halaman menampilkan judul dan materi Jenis-Jenis Garis saja.
- [ ] Verifikasi quick prompt AI Tutor mengubah/menambah percakapan lokal.
- [ ] Verifikasi tab materi dapat berpindah dan tab non-ringkasan menampilkan placeholder sumber.
- [ ] Verifikasi diagram menampilkan garis sejajar, berpotongan, tegak lurus, dan transversal.
- [ ] Verifikasi tampilan tidak berubah berdasarkan kelompok Penjelajah/Pengintai.
- [ ] Verifikasi tombol keluar sesi kembali ke Ruang Kelas atau Beranda.
- [ ] Verifikasi layout desktop dua panel dan mobile satu kolom.
- [ ] Jalankan lint dan build melalui workflow framework setelah implementasi.
