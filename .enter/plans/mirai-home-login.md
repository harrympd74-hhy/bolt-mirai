# Rencana: Hubungkan Menu Siswa ke Ruang Guru dan Jadwal Semester

## Context
Dasbor siswa sudah memiliki menu jadwal, ruang kelas, dan ruang belajar, tetapi klik menu jadwal semester masih masuk placeholder dan ruang siswa belum memiliki jalur yang jelas ke ruang pembelajaran yang digunakan guru. Pengguna meminta Ruang Pertemuan siswa terhubung ke ruang pembelajaran guru, serta Jadwal Semester memakai data jadwal yang sama dengan jadwal pada beranda siswa.

## Pendekatan
1. Pertahankan `ScheduleList` sebagai sumber tampilan jadwal bersama dan gunakan komponen itu untuk halaman/menu `Jadwal Semester`, sehingga data yang tampil identik dengan jadwal pada beranda siswa.
2. Tambahkan halaman siswa khusus `StudentSchedulePage` yang menampilkan jadwal semester lengkap, state loading/kosong/demo, dan tombol masuk ke ruang pertemuan berdasarkan jadwal yang dipilih.
3. Ubah menu sidebar siswa menjadi `Ruang Pertemuan` dan arahkan kliknya ke ruang pembelajaran aktif (`RuangKelasAktif`), bukan placeholder. Ruang pertemuan membawa topik dan identitas kelas yang sama dengan ruang belajar guru.
4. Tambahkan navigasi/CTA yang konsisten dari kartu jadwal siswa ke ruang pertemuan. Untuk mode demo, gunakan kelas VII-A dan materi yang sudah tersedia; untuk sesi Auth nyata, data jadwal backend tetap menjadi sumber otoritatif.
5. Jangan mengubah alur admin. Perubahan hanya pada dasbor siswa dan komponen jadwal/ruang yang dipakai bersama.

## File yang dibuat/diubah
- `src/pages/SiswaDashboard.tsx`: menu Ruang Pertemuan, routing internal Jadwal Semester, dan routing ruang belajar.
- `src/pages/siswa/StudentSchedulePage.tsx`: halaman jadwal semester siswa menggunakan `ScheduleList`.
- `src/components/shared/ScheduleList.tsx`: opsional menambahkan callback pilih jadwal dan tombol ruang pertemuan.
- `src/pages/siswa/RuangKelasAktif.tsx`: menerima konteks jadwal/kelas bila diperlukan agar ruang siswa sesuai jadwal guru.

## Implementation checklist
- [ ] Tambahkan label/menu `Ruang Pertemuan` pada sidebar siswa dan arahkan ke state ruang kelas aktif.
- [ ] Buat `StudentSchedulePage` dengan `ScheduleList` sebagai sumber data yang sama dengan beranda siswa.
- [ ] Hubungkan klik `Jadwal Semester` ke `StudentSchedulePage`, bukan placeholder.
- [ ] Hubungkan klik `Ruang Pertemuan` ke `RuangKelasAktif` dengan topik dan kelas VII-A demo.
- [ ] Tambahkan tombol masuk ruang pertemuan pada item jadwal bila konteks jadwal tersedia.
- [ ] Pertahankan fallback demo tanpa menampilkan data palsu sebagai data backend nyata.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Klik `Jadwal Pelajaran > Jadwal Semester` menampilkan jadwal yang sama dengan kartu jadwal beranda siswa.
- [ ] Klik `Ruang Pertemuan` membuka ruang pembelajaran aktif, bukan halaman placeholder.
- [ ] Jadwal yang dipilih dapat membawa siswa ke ruang pembelajaran yang sesuai.
- [ ] Navigasi mobile dan desktop menutup sidebar setelah pilihan dibuat.
- [ ] State kosong dan fallback demo tetap tampil jelas.
- [ ] Dasbor guru dan admin tidak mengalami perubahan perilaku yang tidak diminta.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
