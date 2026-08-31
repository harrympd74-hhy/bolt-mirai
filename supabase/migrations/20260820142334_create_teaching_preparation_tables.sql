/*
# Create teaching preparation tables for guru

1. New Tables
- `teaching_materials` — bahan ajar yang dibuat guru (title, subject, description, content, class_id, teacher_id)
- `question_banks` — kumpulan soal yang dibuat guru (title, subject, description, questions JSONB, class_id, teacher_id)
- `surveys` — kumpulan angket yang dibuat guru (title, description, questions JSONB, class_id, teacher_id)
- `class_preparations` — persiapan kelas guru untuk jadwal tertentu (schedule_id, teacher_id, class_id, material_id, question_bank_id, survey_id, notes, preparation_date)

2. Relationships
- teaching_materials.teacher_id → teachers.id
- teaching_materials.class_id → classes.id
- question_banks.teacher_id → teachers.id
- question_banks.class_id → classes.id
- surveys.teacher_id → teachers.id
- surveys.class_id → classes.id
- class_preparations.teacher_id → teachers.id
- class_preparations.class_id → classes.id
- class_preparations.schedule_id → schedules.id
- class_preparations.material_id → teaching_materials.id (nullable)
- class_preparations.question_bank_id → question_banks.id (nullable)
- class_preparations.survey_id → surveys.id (nullable)

3. Security
- RLS enabled on all tables.
- Policies: TO anon, authenticated (single-tenant demo app, no Supabase Auth sign-in).
- All data intentionally shared within the school system.

4. Notes
- questions column in question_banks and surveys is JSONB to store flexible question structures.
- class_preparations links to materials, question banks, and surveys so guru can prepare a class by selecting existing items.
*/

-- ============================================================
-- TEACHING MATERIALS (Bahan Ajar)
-- ============================================================
CREATE TABLE IF NOT EXISTS teaching_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  description text,
  content text,
  file_url text,
  file_type text DEFAULT 'pdf',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teaching_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teaching_materials" ON teaching_materials;
CREATE POLICY "anon_select_teaching_materials" ON teaching_materials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teaching_materials" ON teaching_materials;
CREATE POLICY "anon_insert_teaching_materials" ON teaching_materials FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teaching_materials" ON teaching_materials;
CREATE POLICY "anon_update_teaching_materials" ON teaching_materials FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teaching_materials" ON teaching_materials;
CREATE POLICY "anon_delete_teaching_materials" ON teaching_materials FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- QUESTION BANKS (Kumpulan Soal)
-- ============================================================
CREATE TABLE IF NOT EXISTS question_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_question_banks" ON question_banks;
CREATE POLICY "anon_select_question_banks" ON question_banks FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_question_banks" ON question_banks;
CREATE POLICY "anon_insert_question_banks" ON question_banks FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_question_banks" ON question_banks;
CREATE POLICY "anon_update_question_banks" ON question_banks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_question_banks" ON question_banks;
CREATE POLICY "anon_delete_question_banks" ON question_banks FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- SURVEYS (Kumpulan Angket)
-- ============================================================
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_surveys" ON surveys;
CREATE POLICY "anon_select_surveys" ON surveys FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_surveys" ON surveys;
CREATE POLICY "anon_insert_surveys" ON surveys FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_surveys" ON surveys;
CREATE POLICY "anon_update_surveys" ON surveys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_surveys" ON surveys;
CREATE POLICY "anon_delete_surveys" ON surveys FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- CLASS PREPARATIONS (Persiapan Kelas)
-- ============================================================
CREATE TABLE IF NOT EXISTS class_preparations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES schedules(id) ON DELETE SET NULL,
  material_id uuid REFERENCES teaching_materials(id) ON DELETE SET NULL,
  question_bank_id uuid REFERENCES question_banks(id) ON DELETE SET NULL,
  survey_id uuid REFERENCES surveys(id) ON DELETE SET NULL,
  title text NOT NULL,
  notes text,
  preparation_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE class_preparations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_class_preparations" ON class_preparations;
CREATE POLICY "anon_select_class_preparations" ON class_preparations FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_class_preparations" ON class_preparations;
CREATE POLICY "anon_insert_class_preparations" ON class_preparations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_class_preparations" ON class_preparations;
CREATE POLICY "anon_update_class_preparations" ON class_preparations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_class_preparations" ON class_preparations;
CREATE POLICY "anon_delete_class_preparations" ON class_preparations FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_teaching_materials_teacher ON teaching_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_class ON teaching_materials(class_id);
CREATE INDEX IF NOT EXISTS idx_question_banks_teacher ON question_banks(teacher_id);
CREATE INDEX IF NOT EXISTS idx_question_banks_class ON question_banks(class_id);
CREATE INDEX IF NOT EXISTS idx_surveys_teacher ON surveys(teacher_id);
CREATE INDEX IF NOT EXISTS idx_surveys_class ON surveys(class_id);
CREATE INDEX IF NOT EXISTS idx_class_preparations_teacher ON class_preparations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_preparations_class ON class_preparations(class_id);
CREATE INDEX IF NOT EXISTS idx_class_preparations_schedule ON class_preparations(schedule_id);
