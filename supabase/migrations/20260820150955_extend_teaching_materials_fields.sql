/*
# Add extended fields to teaching_materials for Bahan Ajar input form

1. Modified Tables
- `teaching_materials` — add columns to support the detailed bahan ajar input form:
  - `topic` (text) — topik/materi spesifik
  - `learning_objectives` (text) — tujuan pembelajaran
  - `tags` (text) — tag/kata kunci (comma-separated)
  - `material_type` (text, default 'document') — jenis: document, video, presentation, audio, link
  - `thumbnail_url` (text) — URL gambar sampul
  - `label_color` (text, default 'blue') — warna label: blue, orange, green, purple, pink, teal
  - `access_level` (text, default 'class') — tingkat akses: class, public, private
  - `is_published` (boolean, default false) — status publikasi
  - `is_favorite` (boolean, default false) — ditandai sebagai favorit
  - `allow_comments` (boolean, default true) — izinkan komentar siswa
  - `notify_students` (boolean, default false) — notifikasi ke siswa
  - `file_size` (bigint) — ukuran file dalam bytes
  - `status` (text, default 'draft') — status: draft, published

2. Security
- No changes to existing RLS policies.

3. Notes
- All new columns are nullable or have defaults so existing rows remain valid.
- Uses DO $$ ... END $$ to conditionally add columns only if they don't exist (idempotent).
*/

DO $$ BEGIN
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS topic text;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS learning_objectives text;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS tags text;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS material_type text DEFAULT 'document';
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS thumbnail_url text;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS label_color text DEFAULT 'blue';
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'class';
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS allow_comments boolean DEFAULT true;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS notify_students boolean DEFAULT false;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS file_size bigint;
  ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
END $$;
