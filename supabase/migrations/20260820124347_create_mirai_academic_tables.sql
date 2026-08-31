/*
# Create MIRAI academic tables (classes, schedules, assignments, grades, attendance, materials, announcements)

1. New Tables
- `classes`: kelas aktif (VII-A, VII-B, VII-C) dengan wali kelas & tahun ajaran
- `schedules`: jadwal mengajar guru per kelas (hari, jam, mapel, ruang)
- `assignments`: tugas yang dibuat guru untuk kelas tertentu
- `grades`: nilai siswa per tugas/jenis penilaian
- `attendance`: kehadiran siswa harian per kelas
- `materials`: materi/konten pembelajaran yang dibuat guru
- `announcements`: pengumuman dari admin/guru untuk target tertentu
- `teacher_classes`: junction table relasi guru ↔ kelas (satu guru banyak kelas)

2. Relationships
- classes.wali_kelas_id → teachers.id (wali kelas)
- teacher_classes.teacher_id → teachers.id, teacher_classes.class_id → classes.id
- schedules.teacher_id → teachers.id, schedules.class_id → classes.id
- assignments.teacher_id → teachers.id, assignments.class_id → classes.id
- grades.student_id → students.id, grades.assignment_id → assignments.id (nullable)
- attendance.student_id → students.id, attendance.class_id → classes.id
- materials.teacher_id → teachers.id, materials.class_id → classes.id
- announcements.created_by → teachers.id (nullable, admin bisa buat tanpa teacher)

3. Security
- RLS enabled on all tables.
- Policies: TO anon, authenticated (single-tenant demo app, no Supabase Auth sign-in yet).
- All data intentionally shared within the school system.

4. Notes
- students.class_name tetap ada (text), tapi sekarang ada classes table yang lebih terstruktur.
- students bisa dihubungkan ke classes via class_id (nullable untuk backward compat).
- grades.assignment_id nullable untuk mendukung nilai non-tugas (ulangan harian, dll).
*/

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade int NOT NULL DEFAULT 7,
  wali_kelas_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  academic_year text NOT NULL DEFAULT '2025/2026',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_classes" ON classes;
CREATE POLICY "anon_select_classes" ON classes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_classes" ON classes;
CREATE POLICY "anon_insert_classes" ON classes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_classes" ON classes;
CREATE POLICY "anon_update_classes" ON classes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_classes" ON classes;
CREATE POLICY "anon_delete_classes" ON classes FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- TEACHER_CLASSES (junction: guru ↔ kelas)
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teacher_classes" ON teacher_classes;
CREATE POLICY "anon_select_teacher_classes" ON teacher_classes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teacher_classes" ON teacher_classes;
CREATE POLICY "anon_insert_teacher_classes" ON teacher_classes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teacher_classes" ON teacher_classes;
CREATE POLICY "anon_update_teacher_classes" ON teacher_classes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teacher_classes" ON teacher_classes;
CREATE POLICY "anon_delete_teacher_classes" ON teacher_classes FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- SCHEDULES (jadwal mengajar)
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject text NOT NULL,
  day text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_schedules" ON schedules;
CREATE POLICY "anon_select_schedules" ON schedules FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_schedules" ON schedules;
CREATE POLICY "anon_insert_schedules" ON schedules FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_schedules" ON schedules;
CREATE POLICY "anon_update_schedules" ON schedules FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_schedules" ON schedules;
CREATE POLICY "anon_delete_schedules" ON schedules FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- ASSIGNMENTS (tugas)
-- ============================================================
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  deadline timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assignments" ON assignments;
CREATE POLICY "anon_select_assignments" ON assignments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_assignments" ON assignments;
CREATE POLICY "anon_insert_assignments" ON assignments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_assignments" ON assignments;
CREATE POLICY "anon_update_assignments" ON assignments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_assignments" ON assignments;
CREATE POLICY "anon_delete_assignments" ON assignments FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- GRADES (nilai)
-- ============================================================
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES assignments(id) ON DELETE SET NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  subject text NOT NULL,
  assessment_type text NOT NULL DEFAULT 'tugas',
  score numeric NOT NULL,
  max_score numeric NOT NULL DEFAULT 100,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_grades" ON grades;
CREATE POLICY "anon_select_grades" ON grades FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_grades" ON grades;
CREATE POLICY "anon_insert_grades" ON grades FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_grades" ON grades;
CREATE POLICY "anon_update_grades" ON grades FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_grades" ON grades;
CREATE POLICY "anon_delete_grades" ON grades FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- ATTENDANCE (kehadiran)
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'hadir',
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_attendance" ON attendance;
CREATE POLICY "anon_select_attendance" ON attendance FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_attendance" ON attendance;
CREATE POLICY "anon_insert_attendance" ON attendance FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_attendance" ON attendance;
CREATE POLICY "anon_update_attendance" ON attendance FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_attendance" ON attendance;
CREATE POLICY "anon_delete_attendance" ON attendance FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- MATERIALS (materi/konten pembelajaran)
-- ============================================================
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  content_url text,
  file_type text DEFAULT 'pdf',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_materials" ON materials;
CREATE POLICY "anon_select_materials" ON materials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_materials" ON materials;
CREATE POLICY "anon_insert_materials" ON materials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_materials" ON materials;
CREATE POLICY "anon_update_materials" ON materials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_materials" ON materials;
CREATE POLICY "anon_delete_materials" ON materials FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- ANNOUNCEMENTS (pengumuman)
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  author_role text NOT NULL DEFAULT 'admin',
  target text NOT NULL DEFAULT 'all',
  target_class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_announcements" ON announcements;
CREATE POLICY "anon_select_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_announcements" ON announcements;
CREATE POLICY "anon_insert_announcements" ON announcements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_announcements" ON announcements;
CREATE POLICY "anon_update_announcements" ON announcements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_announcements" ON announcements;
CREATE POLICY "anon_delete_announcements" ON announcements FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- Add class_id to students (nullable for backward compat)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'class_id') THEN
    ALTER TABLE students ADD COLUMN class_id uuid REFERENCES classes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON teacher_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_class ON teacher_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON schedules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class ON schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_assignment ON grades(assignment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_materials_class ON materials(class_id);
CREATE INDEX IF NOT EXISTS idx_materials_teacher ON materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);