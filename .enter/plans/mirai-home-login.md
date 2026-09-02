# Rencana: Fitur Aktivasi & Pembatalan (Deaktivasi) Pertemuan Kelas Guru

## Context
Pengguna meminta agar pada Pertemuan Kelas di dasbor guru terdapat tombol **Aktifkan** dan tombol **Membatalkan (Nonaktifkan)**. Dengan demikian, pertemuan yang aktif dapat dibatalkan kembali ke status belum aktif/draft, diedit/diperbarui oleh guru, dan diaktifkan kembali kapan saja.

## Pendekatan
1. Di `demoClassroomStore.ts`, tambahkan metode `deactivate(id: string)` yang mengubah status pertemuan menjadi `draft` dan `is_active: false`.
2. Di `ClassMeetingsBoard.tsx`:
   - Tambahkan tombol **Batalkan Aktivasi** untuk pertemuan yang sedang aktif/diterbitkan.
   - Saat diklik, panggil pembatalan di `classMeetingStore` dan `demoClassroomStore`.
   - Pastikan ikon/tombol Edit pensil selalu dapat diakses untuk pertemuan yang dalam status `draft`/`inactive` (serta `published`), sehingga guru dapat dengan mudah memperbarui tanggal/jam, materi, dan asesmen.
   - Setelah diedit, guru dapat menekan tombol **Aktifkan untuk Siswa** kembali untuk mengaktifkannya lagi.
3. Pastikan status "Aktif" / "Belum Aktif" pada kartu guru dan dasbor siswa langsung ter-update secara real-time.

## File yang diubah
- `src/data/demoClassroomStore.ts`: Tambahkan metode `deactivate(id)`.
- `src/components/guru/ClassMeetingsBoard.tsx`: Tambahkan tombol "Batalkan Aktivasi" dan dukung alur edit & re-aktivasi.

## Implementation checklist
- [ ] Tambahkan metode `deactivate` pada `demoClassroomStore`.
- [ ] Tambahkan tombol "Batalkan Aktivasi" pada kartu pertemuan yang aktif di `ClassMeetingsBoard`.
- [ ] Izinkan tombol Edit pensil pada kartu untuk membuka modal pengeditan.
- [ ] Pastikan setelah pembatalan, status berubah menjadi "Belum Aktif" dan dapat diaktifkan kembali.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Pada pertemuan yang aktif, tombol "Batalkan Aktivasi" tampil.
- [ ] Menekan tombol "Batalkan Aktivasi" mengubah status menjadi "Belum Aktif".
- [ ] Pertemuan yang belum aktif dapat diedit (tanggal, materi, asesmen, dsb.).
- [ ] Pertemuan yang baru diedit dapat diaktifkan kembali dengan tombol "Aktifkan untuk Siswa".
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
