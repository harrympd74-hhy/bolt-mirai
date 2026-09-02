# Rencana: Relevansi Status Opsi "Aktif" dan "Tidak Aktif" Pertemuan Kelas

## Context
Pengguna meminta agar pada kartu Pertemuan Kelas di dasbor guru terdapat opsi pilihan status: **Aktif** dan **Tidak Aktif** (bisa berbentuk dropdown/toggle/tombol opsi) sehingga guru dapat mengaktifkan atau menonaktifkan pertemuan dengan mudah, memperbarui data sesuai kebutuhan, dan menggunakan data tersebut sesuai jadwal.

## Pendekatan
1. Di `demoClassroomStore.ts`, tambahkan metode `deactivate(id: string)` yang merubah `status: "draft"` dan `is_active: false`.
2. Di `ClassMeetingsBoard.tsx`:
   - Pada setiap kartu pertemuan, sediakan elemen pilihan status **Status Akses**:
     - `Aktif` (Diterbitkan untuk siswa & live)
     - `Tidak Aktif` (Draft / disimpan untuk pengeditan)
   - Bila diset ke `Aktif`, panggil `activate(item)`.
   - Bila diset ke `Tidak Aktif`, panggil `deactivate(item)`.
   - Tombol/ikon pengeditan (Pencil) tetap selalu aktif untuk memperbarui judul, tanggal/jam, materi, dan asesmen kapan saja.
3. Sinkronisasi perubahan status ke dasbor siswa dan kelas aktif secara real-time.

## File yang diubah
- `src/data/demoClassroomStore.ts`
- `src/components/guru/ClassMeetingsBoard.tsx`

## Implementation checklist
- [ ] Tambahkan metode `deactivate` pada `demoClassroomStore`.
- [ ] Buat kontrol opsi status (`Aktif` / `Tidak Aktif`) pada setiap kartu di `ClassMeetingsBoard`.
- [ ] Hubungkan perubahan opsi ke `activate` dan `deactivate`.
- [ ] Pastikan data pertemuan dapat diedit kapan saja dan disinkronkan ke siswa saat diaktifkan.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Kartu pertemuan menampilkan opsi status "Aktif" dan "Tidak Aktif".
- [ ] Memilih "Tidak Aktif" menonaktifkan pertemuan sehingga bisa diedit tanpa mengganggu siswa.
- [ ] Memilih "Aktif" mengaktifkan kembali pertemuan sehingga langsung dapat diakses siswa.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
