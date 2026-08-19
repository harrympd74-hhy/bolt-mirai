import { BarChart3, BookOpen, Home, Settings, Users, UserCircle, UsersRound, type LucideIcon } from "lucide-react";
export interface NavItem { id: string; label: string; icon: LucideIcon; children?: { id: string; label: string }[]; }
export const navItems: NavItem[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "kelas", label: "Kelas Saya", icon: Users, children: [{ id: "daftar-kelas", label: "Daftar Kelas" }, { id: "buat-kelas", label: "Buat Kelas Baru" }, { id: "jadwal-kelas", label: "Jadwal Kelas" }, { id: "arsip-kelas", label: "Arsip Kelas" }] },
  { id: "siswa", label: "Siswa", icon: UsersRound, children: [{ id: "semua-siswa", label: "Semua Siswa" }, { id: "progress-capaian", label: "Progress & Capaian" }, { id: "kelompok-belajar", label: "Kelompok Belajar" }, { id: "productive-struggle", label: "Productive Struggle" }, { id: "tutor-sebaya", label: "Tutor Sebaya" }] },
  { id: "pembelajaran", label: "Pembelajaran", icon: BookOpen, children: [{ id: "rencana-pembelajaran", label: "Rencana Pembelajaran" }, { id: "asesmen", label: "Asesmen (Awal & Akhir)" }, { id: "materi-konten", label: "Materi & Konten" }, { id: "ai-tutor", label: "AI Tutor MIRAI" }, { id: "refleksi-siswa", label: "Refleksi Siswa" }, { id: "aktivitas-kolaboratif", label: "Aktivitas Kolaboratif" }] },
  { id: "laporan", label: "Laporan", icon: BarChart3, children: [{ id: "laporan-kelas", label: "Laporan Kelas" }, { id: "learning-analytics", label: "Learning Analytics" }, { id: "dampak-pembelajaran", label: "Dampak Pembelajaran" }, { id: "partisipasi-kehadiran", label: "Partisipasi & Kehadiran" }, { id: "ekspor-data", label: "Ekspor Data" }] },
  { id: "pengaturan", label: "Pengaturan", icon: Settings, children: [{ id: "preferensi-tampilan", label: "Preferensi Tampilan" }, { id: "notifikasi", label: "Notifikasi" }, { id: "integrasi-lms", label: "Integrasi LMS" }, { id: "privasi-data", label: "Privasi & Data" }] },
  { id: "profil-guru", label: "Profil Guru", icon: UserCircle, children: [{ id: "edit-profil", label: "Edit Profil" }, { id: "keamanan-akun", label: "Keamanan Akun" }, { id: "bantuan-panduan", label: "Bantuan & Panduan" }, { id: "keluar", label: "Keluar" }] },
];
export const breadcrumbMap: Record<string, string> = Object.fromEntries(navItems.flatMap((item) => [{ id: item.id, label: item.label }, ...(item.children?.map((child) => ({ id: child.id, label: child.label })) ?? [])]).map((entry) => [entry.id, entry.label]));
export const mobileBottomItems = [navItems[0], navItems[1], navItems[2], navItems[3], navItems[4]];
