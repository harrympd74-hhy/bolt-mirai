export const siswaProfile = { name: "Ahmad Rizki Pratama", className: "VII-A", nisn: "0091234501", school: "SMPN 1 Bandung", streak: 12, dayaJuang: 82, totalPoints: 3280 };
export const lessons = [
  { time: "07.30–09.00", subject: "Sudut", teacher: "Guru Matematika", room: "R-101", status: "ongoing", color: "turquoise" },
  { time: "09.15–10.45", subject: "Garis-Garis Sejajar", teacher: "Guru Matematika", room: "R-101", status: "soon", color: "sapphire" },
  { time: "10.45–12.00", subject: "Latihan Sudut dan Garis Kelas 7", teacher: "Guru Matematika", room: "R-102", status: "upcoming", color: "yellow" },
  { time: "13.00–14.30", subject: "Proyek Garis Sejajar", teacher: "Guru Matematika", room: "Ruang Praktik", status: "upcoming", color: "brown" },
] as const;
export const assignments = [
  { subject: "Sudut", title: "Mengidentifikasi jenis-jenis sudut", due: "Hari ini", urgent: true, done: false },
  { subject: "Garis-Garis Sejajar", title: "Menggambar garis-garis sejajar dan transversal", due: "Besok", urgent: false, done: false },
  { subject: "Sudut", title: "Rangkuman sifat sudut bertolak belakang", due: "3 hari lagi", urgent: false, done: true },
  { subject: "Garis-Garis Sejajar", title: "Kuis sudut sehadap dan dalam sepihak", due: "5 hari lagi", urgent: false, done: false },
] as const;
export const groups = [
  { name: "VII-A", students: 32, progress: 82, tone: "turquoise" },
  { name: "Tim Pengintai", students: 5, progress: 76, tone: "sapphire" },
  { name: "Tim Navigator", students: 4, progress: 88, tone: "yellow" },
] as const;
