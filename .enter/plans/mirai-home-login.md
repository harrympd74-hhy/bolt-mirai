# Rencana: Membangun Dasbor Siswa MIRAI Final

## Context
Dokumen `MIRAI_DASBOR_SISWA_FINAL.md` menetapkan blueprint final dasbor siswa dan Productive Struggle: Beranda komunikatif, Card Global Struggle, Ruang Kelas dan Ruang Kolaborasi, alur pengerjaan 5 langkah Warshauer/Pólya, AI Tutor Socratic, serta data skor yang dapat dilihat guru secara agregat/detail sesuai hak akses. Dasbor siswa saat ini masih berisi data demo, menu placeholder, dan tutor berbasis kuis/chat sederhana.

## Pendekatan
Implementasi dilakukan sebagai satu vertical slice yang dapat diuji end-to-end, tanpa mengubah fitur admin/guru di luar integrasi yang diperlukan:

1. Beranda siswa disusun ulang menjadi header Halo/tanggal/kelas, stat streak-daya juang-poin, kartu kelas hari ini, tugas pending, AI Tutor, jadwal, lanjut belajar, kelompok belajar, jurnal, pencapaian, dan Card Global Problem Struggle. Card siswa hanya menampilkan skor agregat + label positif, tanpa breakdown, nama siswa lain, atau warna merah.
2. Buat tabel `struggle_steps` dan `struggle_scores` dengan RLS aktif. Simpan event lima langkah, skor aspek 0–100, context type, total score, status, durasi stuck, dan timestamps. Siswa hanya membaca agregat miliknya; guru/admin membaca data sesuai role/kelas.
3. Implementasikan formula rule-based v1 dari dokumen: percobaan 25%, waktu 20%, inkonsistensi 20%, hint 15%, rata-rata Q/E/G/A 20%. Label siswa mengikuti rentang 0–30, 31–60, 61–85, 86–100 dengan warna hijau/mustard/ungu.
4. Refactor sesi tutor yang ada menjadi 5 fase berurutan `Question → Encourage → Give Time → Acknowledge → Execute & Check`; fase 1–4 hanya memberi pertanyaan Socratic, bukan jawaban final. Setiap fase memiliki input, tombol petunjuk, timer, dan checklist progres. Mode `classroom` dan `collaboration` dipertahankan pada backend AI Tutor.
5. Tambahkan Ruang Kolaborasi untuk kelompok belajar/tugas kelompok dan AI Tutor fasilitator/observer; event dicatat sebagai `context_type = collaboration`.
6. Tambahkan report Struggle guru pada Kehadiran & Nilai dengan filter konteks, status, detail timeline ringkas, dan aksi intervensi. Live alert tetap terpisah dari report.
7. Buat backend function `struggle-management` untuk start session, append step, calculate score, read student aggregate, dan teacher report. Validasi role/ownership dilakukan server-side.

## File yang dibuat/diubah
- `src/pages/SiswaDashboard.tsx`: layout final dan routing menu siswa.
- `src/pages/siswa/AITutorSession.tsx`: alur 5 fase, timer, prompt Socratic, logging.
- `src/pages/siswa/CollaborationPage.tsx`: kelompok, tugas kelompok, AI Tutor observer.
- `src/components/student/StruggleCard.tsx`: Card Global siswa.
- `src/components/student/WarshauerStepFlow.tsx`: input/progress per fase.
- `src/components/student/StudentHomeSections.tsx`: kartu tugas/jadwal/jurnal/pencapaian reusable.
- `src/components/guru/StruggleReport.tsx`: report guru dengan filter `semua/classroom/collaboration`.
- `src/components/guru/navConfig.ts`: menu siswa dan submenu guru `Kehadiran & Nilai → Struggle`.
- `src/pages/GuruDashboard.tsx`: routing report Struggle.
- Migration melalui `supabase_migration`: `struggle_steps`, `struggle_scores`, index, RLS.
- `supabase/functions/struggle-management/index.ts`: session/step/score/report API.
- `src/lib/struggleScore.ts`: formula dan label/warna bersama.
- Generated `src/integrations/supabase/types.ts` hanya diregenerasi otomatis.

## Batasan keamanan dan pedagogis
- Siswa tidak melihat breakdown per soal, nama siswa lain, ranking, komponen mentah, atau warna merah.
- AI Tutor tidak memberi jawaban final pada fase Question/Encourage/Give Time/Acknowledge.
- Guru melihat rincian sesuai kelas/konteks; siswa hanya melihat agregat miliknya.
- RLS aktif pada setiap tabel baru dalam migration yang sama.
- Tidak menyimpan password/token dalam log struggle.
- Mulai dari rule-based scoring v1; klasifikasi model AI tidak ditambahkan pada tahap ini.

## Implementation checklist
- [ ] Buat migration `struggle_steps` dan `struggle_scores` dengan RLS, index, dan policy siswa/guru/admin.
- [ ] Verifikasi schema/RLS setelah migration.
- [ ] Buat `src/lib/struggleScore.ts` dengan formula final dan label positif.
- [ ] Implementasikan backend function `struggle-management` dengan validasi JWT/role/ownership.
- [ ] Buat Card Global Struggle di Beranda siswa tanpa breakdown sensitif.
- [ ] Susun ulang Beranda siswa sesuai blueprint tanpa menghilangkan akses jadwal/pertemuan.
- [ ] Refactor `AITutorSession` menjadi lima fase berurutan dengan timer, input, hint Socratic, dan logging.
- [ ] Tambahkan mode `classroom` dan `collaboration` pada pemanggilan tutor.
- [ ] Buat halaman Ruang Kolaborasi dan hubungkan menu siswa.
- [ ] Tambahkan report Struggle guru dengan filter konteks, status, dan detail timeline ringkas.
- [ ] Hubungkan report ke `GuruDashboard` tanpa merusak manajemen pertemuan.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Beranda siswa menampilkan Card Global Problem Struggle dengan skor dan label positif.
- [ ] Skor 0–30, 31–60, 61–85, 86–100 menghasilkan label/warna sesuai spesifikasi dan tidak pernah merah.
- [ ] Fase tutor hanya dapat dilalui berurutan; fase 1–4 tidak menampilkan jawaban final.
- [ ] Tombol petunjuk, input refleksi, timer, dan progress fase berfungsi.
- [ ] Setiap fase tersimpan sebagai event tanpa password/token.
- [ ] Siswa hanya membaca skor agregat miliknya; query siswa lain ditolak backend/RLS.
- [ ] Guru dapat memfilter report `Semua`, `Ruang Kelas`, dan `Ruang Kolaborasi`.
- [ ] Status `Stuck` hanya muncul setelah threshold waktu tanpa progres, bukan hanya skor tinggi.
- [ ] Ruang Kolaborasi menggunakan mode fasilitator/observer dan context type yang benar.
- [ ] Jadwal/pertemuan siswa yang sudah dibangun tetap dapat diakses.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
