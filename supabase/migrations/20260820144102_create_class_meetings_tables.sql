/*
# Create class meetings tables for Pertemuan Kelas

1. New Tables
- `class_meetings` — pertemuan kelas yang dibuat guru (meeting_number, title, schedule_id, class_id, teacher_id, meeting_date, start_time, end_time, locked, completed, partially_completed, notes)
- `meeting_materials` — bahan ajar & link yang dilink ke pertemuan (type: file/link, title, file_url, file_type, external_url)
- `meeting_assignments` — tugas yang dibuat guru untuk pertemuan tertentu (title, description, deadline)

2. Relationships
- class_meetings.teacher_id → teachers.id
- class_meetings.class_id → classes.id
- class_meetings.schedule_id → schedules.id (nullable)
- meeting_materials.meeting_id → class_meetings.id
- meeting_assignments.meeting_id → class_meetings.id

3. Security
- RLS enabled on all tables.
- Policies: TO anon, authenticated (single-tenant demo app).
- All data intentionally shared within the school system.

4. Storage
- Create public bucket `meeting-materials` for file uploads (doc, docx, pdf, ppt, pptx, mp4, flash, flipbook)

5. Notes
- Status computed in frontend from meeting_date, start_time, end_time, locked, completed, partially_completed.
- "Belum Aktif" (silver): >4 days before KBM or >2 hours before KBM.
- "Akan datang" (blue): ≤4 days and ≤2 hours before KBM.
- "Selesai" (green): meeting end time passed or manually marked complete.
- "Sebagian Selesai" (yellow): manually marked partially complete.
- "Terkunci" (dark gray): manually locked by teacher.
*/

-- ============================================================
-- CLASS MEETINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS class_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES schedules(id) ON DELETE SET NULL,
  meeting_number int NOT NULL DEFAULT 1,
  title text NOT NULL,
  meeting_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  locked boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  partially_completed boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE class_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_class_meetings" ON class_meetings;
CREATE POLICY "anon_select_class_meetings" ON class_meetings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_class_meetings" ON class_meetings;
CREATE POLICY "anon_insert_class_meetings" ON class_meetings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_class_meetings" ON class_meetings;
CREATE POLICY "anon_update_class_meetings" ON class_meetings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_class_meetings" ON class_meetings;
CREATE POLICY "anon_delete_class_meetings" ON class_meetings FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- MEETING MATERIALS (bahan ajar files & links)
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES class_meetings(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'file',
  title text NOT NULL,
  file_url text,
  file_type text,
  file_size bigint,
  external_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meeting_materials" ON meeting_materials;
CREATE POLICY "anon_select_meeting_materials" ON meeting_materials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_meeting_materials" ON meeting_materials;
CREATE POLICY "anon_insert_meeting_materials" ON meeting_materials FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_meeting_materials" ON meeting_materials;
CREATE POLICY "anon_update_meeting_materials" ON meeting_materials FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_meeting_materials" ON meeting_materials;
CREATE POLICY "anon_delete_meeting_materials" ON meeting_materials FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- MEETING ASSIGNMENTS (tugas untuk pertemuan)
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES class_meetings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  deadline timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meeting_assignments" ON meeting_assignments;
CREATE POLICY "anon_select_meeting_assignments" ON meeting_assignments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_meeting_assignments" ON meeting_assignments;
CREATE POLICY "anon_insert_meeting_assignments" ON meeting_assignments FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_meeting_assignments" ON meeting_assignments;
CREATE POLICY "anon_update_meeting_assignments" ON meeting_assignments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_meeting_assignments" ON meeting_assignments;
CREATE POLICY "anon_delete_meeting_assignments" ON meeting_assignments FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_class_meetings_teacher ON class_meetings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_meetings_class ON class_meetings(class_id);
CREATE INDEX IF NOT EXISTS idx_class_meetings_schedule ON class_meetings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_class_meetings_date ON class_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meeting_materials_meeting ON meeting_materials(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_assignments_meeting ON meeting_assignments(meeting_id);

-- ============================================================
-- STORAGE BUCKET for meeting materials
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('meeting-materials', 'meeting-materials', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_upload_meeting_materials" ON storage.objects;
CREATE POLICY "anon_upload_meeting_materials" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'meeting-materials');

DROP POLICY IF EXISTS "anon_read_meeting_materials" ON storage.objects;
CREATE POLICY "anon_read_meeting_materials" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'meeting-materials');

DROP POLICY IF EXISTS "anon_delete_meeting_materials" ON storage.objects;
CREATE POLICY "anon_delete_meeting_materials" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'meeting-materials');
