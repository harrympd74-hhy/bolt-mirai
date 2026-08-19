# Rencana: Dashboard Tamu (Guest Dashboard) — MIRAI

## Context
Pengguna ingin membangun **Dashboard Tamu** — halaman showcase publik "SMART DIGITAL LEARNING ECOSYSTEM" yang menampilkan gambaran menyeluruh ekosistem pembelajaran digital cerdas (data agregat saja, tanpa data pribadi/nilai individual). Dasbor ini dibangun **bertahap (3 tahap)**; sesuai kesepakatan, sekarang hanya **Tahap 1** yang dikerjakan lalu ditinjau pengguna.

- **Tahap 1 (sekarang)**: Kerangka halaman + Hero Section (diagram ekosistem) + kartu statistik agregat + footer.
- **Tahap 2 (nanti)**: Learning Journey, Peran AI Tutor MIRAI, Mekanisme Productive Struggle.
- **Tahap 3 (nanti)**: Infografis Dampak, Diagram Ekosistem Kolaborasi, Empat Pilar, Banner penutup + CTA.

## Identitas & Gaya (untuk semua tahap)
- Judul: **SMART DIGITAL LEARNING ECOSYSTEM**
- Subjudul: *Ekosistem Pembelajaran Adaptif, Personal, Kolaboratif, dan Bermakna*
- Slogan: *Belajar Mandiri — Berkolaborasi — Merefleksi — Bertumbuh*
- Gaya: modern, clean, futuristik, card-based, rounded corners, soft shadow, infografis interaktif. Desktop-first (16:9) namun responsif.
- Warna: **Navy Blue** (dominasi), Putih, Biru Muda, Hijau (growth), Oranye (productive struggle), Ungu (AI).

## Pendekatan
1. **Font** di `index.html`: tampilkan font Google "Bricolage Grotesque" (display) + "Plus Jakarta Sans" (body) — karakter premium edtech, hindari font generik.
2. **Token warna tamu** di `src/index.css`: `--tamu-navy`, `--tamu-navy-deep`, `--tamu-sky`, `--tamu-sky-soft`, `--tamu-green`, `--tamu-orange`, `--tamu-purple` + kelas utilitas `.tamu-hero-bg` (gradient navy mesh) dan efek glow.
3. **Route** `/tamu` di `src/router.tsx` → `GuestDashboard`.
4. **Login** `src/pages/Index.tsx`: peran "Tamu" (key `tamu`) → `navigate("/tamu")` (bukan alert).
5. **Halaman showcase** satu file utama + komponen seksi:
   - `src/pages/GuestDashboard.tsx` — shell halaman: sticky header (logo + judul + slogan + CTA kembali ke beranda), konten seksi, footer.
   - `src/pages/tamu/Hero.tsx` — hero: judul, subjudul, slogan, dan **diagram ekosistem** (Siswa di pusat; dikelilingi Guru, AI Tutor MIRAI, Tutor Sebaya, Orang Tua, Data, Teknologi) dibuat dengan CSS/SVG (node orbit + garis koneksi).
   - `src/pages/tamu/Stats.tsx` — kartu statistik agregat (demo): Total Siswa 487, Kelas Aktif 18, Aktivitas/minggu 4.250, Interaksi AI 12.800, Partisipasi Orang Tua 68%, Penyelesaian Tugas 87%.
   - Penanda kecil di bawah seksi (mis. "Tahap 2 & 3 menyusul") agar halaman terasa utuh meski belum lengkap.
6. Semua data hanya agregat/demo; tidak ada data pribadi.

## File yang diubah/dibuat
- **Edit** `index.html` — tambah Google Fonts (Bricolage Grotesque, Plus Jakarta Sans).
- **Edit** `src/index.css` — token `--tamu-*` + kelas gradient/glow + font display utility.
- **Edit** `src/router.tsx` — route `/tamu`.
- **Edit** `src/pages/Index.tsx` — login `tamu` → `navigate("/tamu")`.
- **Buat** `src/pages/GuestDashboard.tsx` — shell showcase (header + footer).
- **Buat** `src/pages/tamu/Hero.tsx` — hero + diagram ekosistem.
- **Buat** `src/pages/tamu/Stats.tsx` — kartu statistik agregat.

## Implementation checklist
- [ ] `index.html`: tambah `preconnect` + link Google Fonts (Bricolage Grotesque 500–800, Plus Jakarta Sans 400–700).
- [ ] `src/index.css`: tambah token `--tamu-*` (navy/navy-deep/sky/sky-soft/green/orange/purple), `.font-display`, `.tamu-hero-bg` (gradient navy mesh + glow), utilitas card glow.
- [ ] `src/router.tsx`: import + route `{path:"/tamu"}` → `<GuestDashboard />`.
- [ ] `src/pages/Index.tsx`: `LoginModal.submit` — `role.key === "tamu"` → `navigate("/tamu")`.
- [ ] `src/pages/tamu/Stats.tsx`: 6 kartu statistik agregat (ikon lucide + nilai + label, warna aksen hijau/oranye/ungu/biru).
- [ ] `src/pages/tamu/Hero.tsx`: judul, subjudul, slogan, dan diagram ekosistem (pusat Siswa + 6 node pendukung, garis koneksi SVG, animasi ring/float ringan).
- [ ] `src/pages/GuestDashboard.tsx`: sticky header (logo MIRAI + identitas + tombol "Beranda"), urutan seksi Hero → Stats, footer sederhana, penanda "Tahap 2 & 3 menyusul".
- [ ] Semua ikon dari lucide-react (tanpa emoji).

## Verification checklist
- [ ] Buka `http://localhost:3000/tamu` → halaman showcase tampil: header, Hero (judul "SMART DIGITAL LEARNING ECOSYSTEM" + diagram ekosistem), kartu statistik, footer.
- [ ] Diagram ekosistem: 6 node (Guru, AI Tutor MIRAI, Tutor Sebaya, Orang Tua, Data, Teknologi) mengelilingi node pusat "Siswa" dengan garis koneksi terlihat.
- [ ] Tidak ada data pribadi/nilai individual di halaman (hanya angka agregat).
- [ ] Login "Tamu" di `http://localhost:3000` → mengarah ke `/tamu` (bukan alert).
- [ ] Responsif: layout tetap rapi pada lebar desktop (1280px) dan menyusut rapi di layar lebih kecil.
- [ ] `pnpm run build` berhasil tanpa error TypeScript/lint.
