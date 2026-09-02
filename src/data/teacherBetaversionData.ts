export type BetaStudent = { id: string; name: string; nisn: string; className: string; progress: number; attendance: number; group: string; struggle: number };
export const betaStudents: BetaStudent[] = [
  { id: "s-001", name: "Ahmad Rizki Pratama", nisn: "0091234501", className: "VII-A", progress: 82, attendance: 96, group: "Tim Pengintai", struggle: 62 },
  { id: "s-002", name: "Siti Aisyah", nisn: "0091234502", className: "VII-A", progress: 88, attendance: 98, group: "Tim Navigator", struggle: 41 },
  { id: "s-003", name: "Bima Pratama", nisn: "0091234503", className: "VII-B", progress: 74, attendance: 91, group: "Tim Pengintai", struggle: 57 },
  { id: "s-004", name: "Citra Lestari", nisn: "0091234504", className: "VII-B", progress: 91, attendance: 100, group: "Tim Navigator", struggle: 28 },
  { id: "s-005", name: "Dimas Saputra", nisn: "0091234505", className: "VII-C", progress: 68, attendance: 87, group: "Tim Pengintai", struggle: 76 },
];
export const betaClasses = [{ id: "VII-A", name: "VII-A", students: 2, progress: 85, subject: "Matematika", schedule: "Senin & Rabu · 07.30" }, { id: "VII-B", name: "VII-B", students: 2, progress: 83, subject: "Matematika", schedule: "Selasa & Kamis · 09.00" }, { id: "VII-C", name: "VII-C", students: 1, progress: 68, subject: "Matematika", schedule: "Jumat · 07.30" }];
export const betaGroups = [{ name: "Tim Pengintai", members: 3, progress: 76 }, { name: "Tim Navigator", members: 2, progress: 88 }];
