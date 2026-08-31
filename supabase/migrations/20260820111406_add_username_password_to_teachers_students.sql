-- Add username and password columns to teachers and students tables
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS password text;

-- Update existing rows with default credentials
UPDATE teachers SET username = nip, password = 'guru123' WHERE username IS NULL;
UPDATE students SET username = nis, password = 'siswa123' WHERE username IS NULL;
