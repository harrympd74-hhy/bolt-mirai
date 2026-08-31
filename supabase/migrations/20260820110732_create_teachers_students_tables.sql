/*
# Create teachers and students tables

1. New Tables
- `teachers`
  - id (uuid, primary key)
  - nip (text, unique) — Nomor Induk Pegawai
  - full_name (text, not null) — nama lengkap guru
  - email (text) — email guru
  - phone (text) — nomor telepon
  - subject (text) — mata pelajaran yang diampu
  - gender (text) — 'L' atau 'P'
  - is_active (boolean, default true) — status aktif mengajar
  - created_at (timestamptz, default now())
- `students`
  - id (uuid, primary key)
  - nis (text, unique) — Nomor Induk Siswa
  - full_name (text, not null) — nama lengkap siswa
  - email (text) — email siswa/wali
  - phone (text) — nomor telepon wali
  - class_name (text) — kelas (misal IX-A)
  - gender (text) — 'L' atau 'P'
  - is_active (boolean, default true) — status aktif belajar
  - created_at (timestamptz, default now())
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD (single-tenant, no auth screen yet).
3. Notes
- Seed sample rows for demonstration.
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nip text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  subject text,
  gender text DEFAULT 'L',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nis text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  class_name text,
  gender text DEFAULT 'L',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teachers" ON teachers;
CREATE POLICY "anon_select_teachers" ON teachers FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
CREATE POLICY "anon_insert_teachers" ON teachers FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
CREATE POLICY "anon_update_teachers" ON teachers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;
CREATE POLICY "anon_delete_teachers" ON teachers FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE
  TO anon, authenticated USING (true);

-- Sample data
INSERT INTO teachers (nip, full_name, email, phone, subject, gender) VALUES
  ('198501012010011001', 'Siti Aminah, S.Pd.', 'siti.aminah@mirai.sch.id', '081234567890', 'Matematika', 'P'),
  ('198703152011011002', 'Andi Wijaya, S.Pd.', 'andi.wijaya@mirai.sch.id', '081234567891', 'Bahasa Inggris', 'L'),
  ('199001202015011003', 'Dewi Lestari, M.Pd.', 'dewi.lestari@mirai.sch.id', '081234567892', 'IPA Terpadu', 'P')
ON CONFLICT DO NOTHING;

INSERT INTO students (nis, full_name, email, phone, class_name, gender) VALUES
  ('2025001', 'Budi Santoso', 'budi.s@mirai.sch.id', '081200000001', 'IX-A', 'L'),
  ('2025002', 'Citra Kirana', 'citra.k@mirai.sch.id', '081200000002', 'IX-A', 'P'),
  ('2025003', 'Dimas Anggara', 'dimas.a@mirai.sch.id', '081200000003', 'IX-B', 'L'),
  ('2025004', 'Eka Putri', 'eka.p@mirai.sch.id', '081200000004', 'IX-B', 'P')
ON CONFLICT DO NOTHING;
