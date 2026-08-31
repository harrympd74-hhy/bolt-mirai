ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_username text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_password text;

UPDATE students SET parent_username = 'ortu_' || nis, parent_password = 'ortu123' WHERE parent_username IS NULL;
