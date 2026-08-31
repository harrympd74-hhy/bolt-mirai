// ============================================================
// MIRAI - Type Definitions
// Semua entitas dan relasi data platform pembelajaran SMP kelas 7
// ============================================================

// --- Role & Auth ---

export type Role = 'admin' | 'guru' | 'siswa' | 'ortu' | 'tamu';

export interface AuthUser {
  id: string;
  role: Role;
  username: string;
  displayName: string;
  /** ID guru yang terkait (untuk role guru) */
  teacherId?: string;
  /** ID siswa yang terkait (untuk role siswa) */
  studentId?: string;
  /** ID siswa yang anaknya (untuk role ortu) */
  childStudentId?: string;
}

// --- Teacher (Guru) ---

export interface Teacher {
  id: string;
  nip: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  gender: 'L' | 'P';
  username: string | null;
  password: string | null;
  is_active: boolean;
  created_at: string;
}

// --- Student (Siswa) ---

export interface Student {
  id: string;
  nis: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  class_name: string | null;
  class_id: string | null;
  gender: 'L' | 'P';
  username: string | null;
  password: string | null;
  parent_username: string | null;
  parent_password: string | null;
  is_active: boolean;
  created_at: string;
}

// --- Class (Kelas) ---

export interface Kelas {
  id: string;
  name: string;
  grade: number;
  wali_kelas_id: string | null;
  academic_year: string;
  is_active: boolean;
  created_at: string;
}

// --- Teacher-Class junction (relasi guru ↔ kelas) ---

export interface TeacherClass {
  id: string;
  teacher_id: string;
  class_id: string;
  subject: string | null;
  created_at: string;
}

// --- Schedule (Jadwal Mengajar) ---

export interface Schedule {
  id: string;
  teacher_id: string;
  class_id: string;
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string | null;
  created_at: string;
}

// --- Assignment (Tugas) ---

export interface Assignment {
  id: string;
  teacher_id: string;
  class_id: string;
  title: string;
  description: string | null;
  subject: string;
  deadline: string | null;
  status: 'active' | 'closed' | 'graded';
  created_at: string;
}

// --- Grade (Nilai) ---

export interface Grade {
  id: string;
  student_id: string;
  assignment_id: string | null;
  teacher_id: string | null;
  subject: string;
  assessment_type: string;
  score: number;
  max_score: number;
  date: string;
  created_at: string;
}

// --- Attendance (Kehadiran) ---

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  note: string | null;
  created_at: string;
}

// --- Material (Materi) ---

export interface Material {
  id: string;
  teacher_id: string;
  class_id: string;
  title: string;
  description: string | null;
  subject: string;
  content_url: string | null;
  file_type: string;
  created_at: string;
}

// --- Announcement (Pengumuman) ---

export interface Announcement {
  id: string;
  created_by: string | null;
  author_role: Role;
  target: 'all' | 'class';
  target_class_id: string | null;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

// ============================================================
// Composite types (gabungan untuk tampilan UI)
// ============================================================

/** Kelas dengan relasi wali kelas dan jumlah siswa */
export interface KelasWithRelations extends Kelas {
  wali_kelas_name: string | null;
  student_count: number;
  teacher_count: number;
}

/** Siswa dengan relasi kelas */
export interface StudentWithKelas extends Student {
  kelas_name: string | null;
}

/** Jadwal dengan relasi guru & kelas */
export interface ScheduleWithRelations extends Schedule {
  teacher_name: string;
  class_name: string;
}

/** Tugas dengan relasi guru & kelas */
export interface AssignmentWithRelations extends Assignment {
  teacher_name: string;
  class_name: string;
}

/** Nilai dengan relasi siswa & tugas */
export interface GradeWithRelations extends Grade {
  student_name: string;
  student_nis: string;
  assignment_title: string | null;
}

/** Materi dengan relasi guru & kelas */
export interface MaterialWithRelations extends Material {
  teacher_name: string;
  class_name: string;
}

/** Pengumuman dengan info pembuat */
export interface AnnouncementWithAuthor extends Announcement {
  author_name: string;
  target_class_name: string | null;
}

// ============================================================
// Dashboard stat types
// ============================================================

export interface GuruDashboardStats {
  kelasAktif: number;
  totalSiswa: number;
  tugasBelumDinilai: number;
  rataRataKehadiran: number;
}

export interface SiswaDashboardStats {
  mataPelajaran: number;
  tugasAktif: number;
  rataRataNilai: number;
  kehadiran: number;
}

export interface OrtuDashboardStats {
  rataRataNilai: number;
  kehadiran: number;
  tugasAktif: number;
  tagihanTertunda: number;
}
