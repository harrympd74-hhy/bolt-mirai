# Rencana Adaptasi Sesi AI Tutor Siswa Kelas 7

## Context
Kode `AITutorSession` yang diberikan masih menggunakan contoh bangun ruang umum seperti kubus, balok, tabung, dan bola. Dashboard siswa sudah dibatasi pada SMP kelas 7, sehingga sesi tutor harus konsisten dengan dua fokus pembelajaran: **bangun ruang segitiga** dan **jenis-jenis garis**.

## Pendekatan yang direkomendasikan
- Membuat `src/pages/siswa/AITutorSession.tsx` sebagai sesi tutor demo lokal berbasis state, mengikuti pola fase LOT, HOT, dan UP HOT dari kode pengguna.
- Mengganti seluruh materi, opsi, petunjuk, dan feedback menjadi pertanyaan kelas 7 tentang unsur/prisma segitiga, luas/volume sederhana, serta garis sejajar, berpotongan, tegak lurus, dan transversal.
- Mempertahankan alur interaksi: intro, pilihan ganda, petunjuk, konfirmasi, feedback benar/salah, progres fase, dan layar penyelesaian.
- Tidak menghubungkan AI nyata/API atau backend pada tahap ini; label “AI Tutor” hanya menjadi UI tutor demo sampai konfigurasi AI tersedia.
- Menghubungkan tombol mulai aktivitas pada `SiswaDashboard` ke sesi tutor, dengan topik dapat dipilih dari dua kartu materi.
- Menggunakan data siswa kelas VII-A yang sudah ada dan tema semantik dashboard MIRAI.

## File kritis
- `src/pages/siswa/AITutorSession.tsx`: komponen sesi tutor baru.
- `src/pages/SiswaDashboard.tsx`: state topic/session dan tombol mulai aktivitas.
- `src/data/siswaDashboardData.ts`: sumber konteks siswa kelas 7 yang sudah tersedia.
- `src/index.css`: hanya bila diperlukan untuk token tambahan; tidak mengubah tema utama.

## Implementation checklist
- [ ] Tambahkan tipe step tutor, fase LOT/HOT/UP HOT, dan konfigurasi fase.
- [ ] Tambahkan bank soal LOT bangun ruang segitiga dan jenis garis.
- [ ] Tambahkan bank soal HOT/UP HOT dengan perhitungan/prinsip yang sesuai kelas 7.
- [ ] Tambahkan petunjuk dan feedback yang menjelaskan konsep, bukan hanya memberi jawaban.
- [ ] Tambahkan UI progres fase, soal, opsi pilihan ganda, dan tombol konfirmasi.
- [ ] Tambahkan layar hasil dengan jumlah jawaban benar dan fase tertinggi.
- [ ] Hubungkan dua kartu materi pada `SiswaDashboard` ke sesi tutor dengan topik yang benar.
- [ ] Pastikan keluar dari sesi kembali ke Ruang Kelas/beranda tanpa kehilangan aplikasi.
- [ ] Pastikan tidak ada materi kubus, balok, tabung, bola, atau Persamaan Kuadrat tersisa dalam sesi tutor.

## Verification checklist
- [ ] Verifikasi sesi Bangun Ruang Segitiga menampilkan soal unsur prisma, luas permukaan, dan volume.
- [ ] Verifikasi sesi Jenis-Jenis Garis menampilkan soal garis sejajar, berpotongan, tegak lurus, dan transversal.
- [ ] Verifikasi intro, pilihan jawaban, petunjuk, feedback benar/salah, lanjut, dan selesai berjalan.
- [ ] Verifikasi jawaban kosong tidak dapat dikonfirmasi.
- [ ] Verifikasi hasil menghitung jawaban benar sesuai pilihan pengguna.
- [ ] Verifikasi navigasi keluar mengembalikan siswa ke Ruang Kelas.
- [ ] Verifikasi layout tutor tetap terbaca pada mobile dan desktop.
- [ ] Jalankan lint dan build melalui workflow framework setelah implementasi.
