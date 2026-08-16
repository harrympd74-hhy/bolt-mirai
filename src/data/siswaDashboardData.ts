export const siswaProfile = { name: "Ahmad Rizki Pratama", className: "VII-A", nisn: "0091234501", school: "SMPN 1 Bandung", streak: 12, dayaJuang: 82, totalPoints: 3280 };
export const lessons = [
  { time: "07.30–09.00", subject: "Bangun Ruang Segitiga", teacher: "Guru Matematika", room: "R-101", status: "ongoing", color: "turquoise" },
  { time: "09.15–10.45", subject: "Jenis-Jenis Garis", teacher: "Guru Matematika", room: "R-101", status: "soon", color: "sapphire" },
  { time: "10.45–12.00", subject: "Latihan Geometri Kelas 7", teacher: "Guru Matematika", room: "R-102", status: "upcoming", color: "yellow" },
  { time: "13.00–14.30", subject: "Proyek Prisma Segitiga", teacher: "Guru Matematika", room: "Ruang Praktik", status: "upcoming", color: "brown" },
] as const;
export const assignments = [
  { subject: "Bangun Ruang Segitiga", title: "Menghitung luas permukaan prisma segitiga", due: "Hari ini", urgent: true, done: false },
  { subject: "Jenis-Jenis Garis", title: "Menggambar garis sejajar dan tegak lurus", due: "Besok", urgent: false, done: false },
  { subject: "Bangun Ruang Segitiga", title: "Rangkuman unsur-unsur prisma segitiga", due: "3 hari lagi", urgent: false, done: true },
  { subject: "Jenis-Jenis Garis", title: "Kuis garis berpotongan dan transversal", due: "5 hari lagi", urgent: false, done: false },
] as const;
export const groups = [
  { name: "VII-A", students: 32, progress: 82, tone: "turquoise" },
  { name: "Kelompok Geometri", students: 5, progress: 76, tone: "sapphire" },
  { name: "Tim Garis", students: 4, progress: 88, tone: "yellow" },
] as const;
