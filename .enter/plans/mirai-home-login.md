# Rencana Redesign Beranda Dashboard Guru Kelas 7

## Context
Beranda guru saat ini masih berupa hero sederhana, shortcut, dan daftar jadwal. Pengguna ingin tampilan awal dinaikkan kualitasnya agar mendekati referensi dashboard modern: top utility/search area, banner sambutan, kartu metrik, panel jadwal, progres pembelajaran, kalender, pengumuman, daftar kelas, dan akses cepat. Semua data tetap demo lokal dan dibatasi pada SMP kelas 7.

## Pendekatan yang direkomendasikan
- Fokus perubahan pada `src/pages/guru/Beranda.tsx` dan style global yang diperlukan; sidebar, profil, dan route lain tetap dipertahankan.
- Mengubah beranda menjadi dashboard grid responsif dengan hirarki visual seperti referensi, menggunakan kartu semantic `bg-card`, border, shadow, dan token tema MIRAI.
- Menambahkan header konteks guru di area konten: pencarian siswa/materi, notifikasi sederhana, dan profil ringkas dari `defaultProfileData`, tanpa membuat backend pencarian.
- Menambahkan banner sambutan bergradasi tosca–sapphire dengan copy khusus Guru Demo dan konteks kelas 7 SMP, tanpa aset ilustrasi eksternal baru.
- Menambahkan empat metrik demo yang relevan untuk kelas 7: jumlah siswa, kelas diampu, tugas aktif, dan rata-rata nilai.
- Menambahkan panel jadwal hari ini yang hanya berisi VII-A, VII-B, VII-C; panel progres pembelajaran; kalender bulan berjalan; pengumuman; serta kartu kelas VII-A/VII-B/VII-C.
- Menambahkan akses cepat yang tetap memanggil `onNavigate`, sehingga interaksi menuju placeholder yang sudah tersedia tetap berfungsi.
- Menjaga mobile layout satu kolom, tablet dua kolom, dan desktop grid asimetris; menghindari overflow horizontal.

## File kritis
- `src/pages/guru/Beranda.tsx`: struktur dashboard baru dan data demo kelas 7.
- `src/data/guruData.ts`: sumber nama guru, mata pelajaran, kelas ampuh, dan identitas profil.
- `src/index.css`: token tema yang sudah tersedia; hanya ditambah utilitas bila benar-benar diperlukan.

## Implementation checklist
- [ ] Tambahkan utility header beranda dengan search field demo, label guru, dan indikator notifikasi.
- [ ] Ubah hero menjadi banner sambutan dengan konteks Guru Demo, Matematika, dan SMP kelas 7.
- [ ] Tambahkan empat kartu statistik demo untuk siswa, kelas, tugas, dan nilai.
- [ ] Tambahkan panel jadwal hari ini untuk VII-A/VII-B/VII-C dengan status selesai/aktif/akan datang.
- [ ] Tambahkan panel progres pembelajaran berbasis mata pelajaran dan kelas 7.
- [ ] Tambahkan kalender ringkas serta panel pengumuman sekolah.
- [ ] Tambahkan daftar kartu kelas VII-A, VII-B, VII-C dengan jumlah siswa dan progres.
- [ ] Tambahkan area akses cepat yang terhubung ke callback `onNavigate`.
- [ ] Terapkan grid responsif dan state hover/focus yang konsisten dengan tema MIRAI.
- [ ] Pastikan tidak ada data kelas VIII atau IX pada beranda baru.

## Verification checklist
- [ ] Verifikasi `/guru` menampilkan banner, statistik, jadwal, progres, kalender, pengumuman, kelas, dan akses cepat.
- [ ] Verifikasi seluruh label kelas hanya VII-A, VII-B, VII-C atau konteks umum Kelas 7 SMP.
- [ ] Verifikasi tombol jadwal, kelas, bank soal, dan akses cepat memanggil navigasi yang benar.
- [ ] Verifikasi layout desktop mengikuti komposisi dashboard referensi tanpa panel saling tumpang tindih.
- [ ] Verifikasi tablet/mobile menjadi satu kolom atau dua kolom yang terbaca tanpa scroll horizontal.
- [ ] Verifikasi focus-visible pada tombol dan input pencarian.
- [ ] Jalankan lint dan build proyek melalui workflow framework setelah implementasi.
