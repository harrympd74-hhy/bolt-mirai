# Rencana: Revisi Sidebar Menu Dasbor Guru (Accordion + Gaya Baru)

## Context
Pengguna ingin mengganti sidebar menu dasbor guru dengan struktur baru untuk Smart Digital Learning Ecosystem:
- **Accordion** — submenu hanya terbuka saat menu utama diklik (Beranda tanpa submenu; 6 menu lain punya submenu; Profil Guru termasuk submenu "Keluar").
- **Gaya**: modern, clean, **Sapphire Blue–Metallic Gold–Slate Gray–Turquoise**, card-based, dominasi **Navy Blue**.
- Struktur menu utama sederhana (7 menu).

Mengganti struktur lama (`src/components/guru/navConfig.ts` dengan 30+ item flat + section) yang dipakai oleh `Sidebar`, `MobileDrawer`, `MobileBottomNav`, `Topbar`, dan `GuruDashboard`.

## Struktur menu baru
| id | label | submenu (id — label) |
|---|---|---|
| beranda | Beranda | — |
| kelas | Kelas Saya | daftar-kelas — Daftar Kelas; buat-kelas — Buat Kelas Baru; jadwal-kelas — Jadwal Kelas; arsip-kelas — Arsip Kelas |
| siswa | Siswa | semua-siswa — Semua Siswa; progress-capaian — Progress & Capaian; kelompok-belajar — Kelompok Belajar; productive-struggle — Productive Struggle; tutor-sebaya — Tutor Sebaya |
| pembelajaran | Pembelajaran | rencana-pembelajaran — Rencana Pembelajaran; asesmen — Asesmen (Awal & Akhir); materi-konten — Materi & Konten; ai-tutor — AI Tutor MIRAI; refleksi-siswa — Refleksi Siswa; aktivitas-kolaboratif — Aktivitas Kolaboratif |
| laporan | Laporan | laporan-kelas — Laporan Kelas; learning-analytics — Learning Analytics; dampak-pembelajaran — Dampak Pembelajaran; partisipasi-kehadiran — Partisipasi & Kehadiran; ekspor-data — Ekspor Data |
| pengaturan | Pengaturan | preferensi-tampilan — Preferensi Tampilan; notifikasi — Notifikasi; integrasi-lms — Integrasi LMS; privasi-data — Privasi & Data |
| profil-guru | Profil Guru | edit-profil — Edit Profil; keamanan-akun — Keamanan Akun; bantuan-panduan — Bantuan & Panduan; keluar — Keluar |

## Pendekatan
1. **`navConfig.ts`**: ganti tipe `NavItem` menjadi `{id,label,icon,children?}` (tanpa `section`); ekspor `navItems`, `breadcrumbMap` (parent + child), dan `mobileBottomItems` (beranda, kelas, siswa, pembelajaran, laporan).
2. **`Sidebar.tsx`**: render accordion — state `openMenus` lokal; klik menu ber-submenu toggles; klik submenu → `onNavigate(child.id)`; parent aktif jika dirinya atau child-nya aktif; mode collapsed: klik parent → expand sidebar + buka accordion; tooltip tetap.
3. **`MobileDrawer.tsx`**: accordion serupa (submenu di-indent), klik submenu → `onNavigate`.
4. **`GuruDashboard.tsx`**: `navigate(id)` — jika id menu utama (punya children) → arahkan ke child pertama; jika `id==="keluar"` → `window.location.assign("/")`; konten: `beranda` → Beranda, `edit-profil` → ProfilGuru, lainnya → PlaceholderPage (dengan ikon parent/child yang benar); judul breadcrumb di-resolve dari `breadcrumbMap`.
5. **`Topbar.tsx`**: tombol profil → `onNavigate("edit-profil")` (label breadcrumb otomatis benar karena `breadcrumbMap` berisi child).
6. **`Beranda.tsx`**: remap `onNavigate`: `jadwal-mengajar`→`jadwal-kelas`, `detail-kelas`→`daftar-kelas`, quickActions `tugas`→`rencana-pembelajaran`, `presensi`→`partisipasi-kehadiran`, `modul-ajar`→`rencana-pembelajaran`, `sumber-materi`→`materi-konten`.
7. **`index.css`**: perbarui `.guru-sidebar` ke gradient **Navy** (bukan teal); gaya aktif **Metallic Gold + Slate Gray** (`.guru-nav-item-active` dengan inset gold + latar slate, `.guru-nav-child-active` berwarna gold); tambah token `--guru-gold: 45 80% 55%` dan `--guru-slate: 215 20% 42%`.

## File yang diubah
- `src/components/guru/navConfig.ts` (tulis ulang struktur)
- `src/components/guru/Sidebar.tsx` (accordion)
- `src/components/guru/MobileDrawer.tsx` (accordion)
- `src/components/guru/MobileBottomNav.tsx` (pakai item baru — tidak berubah kode, hanya data)
- `src/pages/GuruDashboard.tsx` (navigate + content switch + resolve title)
- `src/components/guru/Topbar.tsx` (profil → edit-profil)
- `src/pages/guru/Beranda.tsx` (remap id navigasi)
- `src/index.css` (gaya sidebar navy + gold/slate)

## Implementation checklist
- [ ] `navConfig.ts`: tipe `NavItem` baru dengan `children?`, 7 menu + submenu sesuai tabel, `breadcrumbMap` mencakup child, `mobileBottomItems` baru.
- [ ] `index.css`: `.guru-sidebar` gradient navy; `.guru-nav-item-active` (inset metallic gold + latar slate) dan `.guru-nav-child-active` (teks gold); token `--guru-gold`, `--guru-slate`.
- [ ] `Sidebar.tsx`: accordion (`openMenus`), chevron kanan/bawah, klik parent toggles, klik child `onNavigate(child)`, highlight parent aktif bila ada child aktif, mode collapsed tetap aman (klik parent → expand + buka).
- [ ] `MobileDrawer.tsx`: accordion dengan submenu indent, klik child `onNavigate(child)`.
- [ ] `GuruDashboard.tsx`: `navigate` menangani parent→child pertama, `keluar`→logout, konten `beranda`→Beranda, `edit-profil`→ProfilGuru, lainnya→PlaceholderPage, judul dari `breadcrumbMap`.
- [ ] `Topbar.tsx`: tombol profil → `onNavigate("edit-profil")`.
- [ ] `Beranda.tsx`: semua `onNavigate` lama di-remap ke id baru.
- [ ] Tidak ada id menu lama yang tersisa di referensi navigasi (grep `jadwal-mengajar|detail-kelas|beban-kerja|kelas-aktif|pilih-mode|bank-soal|jurnal-harian` → 0 selain navConfig lama yang sudah diganti).

## Verification checklist
- [ ] `/guru` tampil: sidebar navy, 7 menu utama sederhana, Beranda aktif.
- [ ] Klik "Kelas Saya" → submenu (Daftar Kelas, Buat Kelas Baru, Jadwal Kelas, Arsip Kelas) terbuka; klik lagi → tertutup. Hanya satu accordion yang terbuka sesuai klik (tidak semua terbuka bersamaan).
- [ ] Klik submenu (mis. "Jadwal Kelas") → konten placeholder sesuai judul; parent "Kelas Saya" tetap ter-highlight.
- [ ] Submenu "Keluar" pada Profil Guru → kembali ke halaman `/` (logout).
- [ ] Tombol "Profil" di topbar → halaman ProfilGuru terbuka (submenu Profil Guru terbuka otomatis).
- [ ] Beranda: akses cepat & kartu kelas mengarah ke halaman baru yang benar (placeholder).
- [ ] Mode collapsed: klik menu ber-submenu → sidebar melebar + accordion terbuka.
- [ ] `pnpm run build` berhasil tanpa error TypeScript/lint.
