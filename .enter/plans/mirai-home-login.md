# Rencana: Dasbor Orang Tua (MIRAI)

## Context
Pengguna ingin membangun dasbor orang tua di ekosistem MIRAI. Saat ini halaman Index (`src/pages/Index.tsx`) sudah punya kartu peran "Orang Tua" tetapi hanya menampilkan `window.alert` saat login. Dasbor orang tua perlu: menu sidebar modern (Dashboard, Profil Anak, Perkembangan Siswa, Angket Kinerja, Infografis, Catatan Guru, Pengaturan) dengan highlight menu aktif berwarna **silver-cream-yellow-brown**.

Mengikuti pola dasbor yang sudah ada di proyek (GuruDashboard dengan komponen Sidebar/Topbar/MobileDrawer, dan halaman-halaman di `src/pages/guru/`). Data tetap demo (sesuai pola aplikasi saat ini, backend belum aktif).

## Pendekatan
1. **Token warna baru** di `src/index.css` untuk palet orang tua (silver, cream, gold, brown) + kelas sidebar `ortu-*` dengan highlight aktif bergradien silver→cream dan aksen garis kuning di kiri.
2. **Route baru** `/orangtua` di `src/router.tsx` → `OrangtuaDashboard`.
3. **Login Index.tsx**: peran "Orang Tua" (key `ortu`) → `navigate("/orangtua")` (bukan alert lagi).
4. **Halaman baru**:
   - `src/pages/OrangtuaDashboard.tsx` — kerangka utama (sidebar + topbar + konten switch), menu 7 item dengan ikon lucide.
   - `src/pages/orangtua/Beranda.tsx` — halaman Dashboard dengan konten relevan untuk orang tua (ringkasan anak, statistik, akses cepat, catatan guru, jadwal).
   - `src/pages/orangtua/PlaceholderPage.tsx` — placeholder "dalam pengembangan" untuk 6 halaman lainnya.
5. Sidebar modern: latar gelap hangat, item aktif memakai highlight **silver-cream** dengan teks cokelat dan aksen kuning; responsif (drawer mobile).

## File yang diubah/dibuat
- **Edit** `src/index.css` — token `--ortu-silver`, `--ortu-cream`, `--ortu-gold`, `--ortu-brown` + kelas `.ortu-sidebar`, `.ortu-nav-item`, `.ortu-nav-item-active`.
- **Edit** `src/router.tsx` — tambah route `/orangtua`.
- **Edit** `src/pages/Index.tsx` — login `ortu` → `navigate("/orangtua")`.
- **Buat** `src/pages/OrangtuaDashboard.tsx` — shell + sidebar + topbar + switch konten.
- **Buat** `src/pages/orangtua/Beranda.tsx` — halaman Dashboard.
- **Buat** `src/pages/orangtua/PlaceholderPage.tsx` — halaman pengganti.

## Menu sidebar
| id | label | ikon (lucide) |
|---|---|---|
| dashboard | Dashboard | LayoutDashboard |
| profil-anak | Profil Anak | UserRound |
| perkembangan | Perkembangan Siswa | TrendingUp |
| angket-kinerja | Angket Kinerja | ClipboardList |
| infografis | Infografis | BarChart3 |
| catatan-guru | Catatan Guru | MessageSquareText |
| pengaturan | Pengaturan | Settings |

## Detail desain
- Sidebar: `background: linear-gradient(180deg, hsl(30 45% 15%), hsl(30 42% 11%))` (cokelat gelap hangat), teks putih/cream.
- Item aktif: `background: linear-gradient(90deg, hsl(0 0% 88%), hsl(45 100% 94%))` (silver→cream), teks `hsl(27 48% 31%)` (brown), `box-shadow: inset 3px 0 0 hsl(43 91% 55%)` (yellow).
- Beranda: hero kartu anak (nama, kelas VII-A, sekolah), kartu statistik (streak, poin, daya juang), akses cepat ke submenu, daftar catatan guru terbaru + jadwal (data demo di dalam komponen, sesuai pola `src/data/siswaDashboardData.ts`).

## Implementation checklist
- [ ] Tambah token warna `ortu-*` dan kelas `.ortu-sidebar`, `.ortu-nav-item`, `.ortu-nav-item-active` di `src/index.css`.
- [ ] Tambah import + route `{path:"/orangtua"}` di `src/router.tsx`.
- [ ] Ubah `LoginModal.submit` di `src/pages/Index.tsx`: `role.key === "ortu"` → `navigate("/orangtua")`.
- [ ] Buat `src/pages/orangtua/PlaceholderPage.tsx` (ikon + judul + teks pengembangan, gaya konsisten).
- [ ] Buat `src/pages/orangtua/Beranda.tsx` dengan hero anak, statistik, akses cepat, catatan guru, jadwal (demo).
- [ ] Buat `src/pages/OrangtuaDashboard.tsx`: 7 menu (id/label/ikon), switch konten, sidebar highlight aktif silver-cream-yellow-brown, topbar dengan breadcrumb, drawer mobile, tombol keluar ke `/`.
- [ ] Pastikan semua ikon dari lucide-react (tanpa emoji).

## Verification checklist
- [ ] Buka `http://localhost:3000/orangtua` → dasbor orang tua tampil, menu aktif "Dashboard" berhighlight silver-cream-yellow-brown.
- [ ] Klik tiap menu → konten berpindah; "Dashboard" menampilkan Beranda, menu lain menampilkan placeholder.
- [ ] Login lewat `http://localhost:3000` kartu "Orang Tua" → mengarah ke `/orangtua` (bukan alert).
- [ ] Responsif: di layar sempit sidebar jadi drawer (tombol menu di topbar).
- [ ] `pnpm run build` berhasil tanpa error TypeScript/lint.
