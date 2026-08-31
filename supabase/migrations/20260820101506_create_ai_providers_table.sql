/*
# Create ai_providers table for AI Connector settings

1. New Tables
- `ai_providers`
  - `id` (uuid, primary key)
  - `provider` (text, not null) — identifier: 'claude' | 'gpt' | 'gemini'
  - `is_active` (boolean, default false) — apakah provider ini yang dipilih admin
  - `api_key` (text) — API key dari vendor AI
  - `model` (text) — nama model yang dipilih
  - `temperature` (numeric, default 0.7)
  - `max_tokens` (integer, default 2048)
  - `top_p` (numeric, default 0.9)
  - `expires_at` (date) — masa aktif berakhir, opsional
  - `expiry_auto_filled` (boolean, default false) — apakah expires_at diisi sistem
  - `saved_at` (timestamptz) — waktu terakhir disimpan
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `ai_providers`.
- Allow anon + authenticated CRUD karena data konfigurasi bersifat shared/single-tenant (belum ada sistem login).
3. Notes
- Hanya satu provider yang is_active = true pada satu waktu (dijaga dari sisi aplikasi).
- Field api_key disimpan sebagai text — untuk produksi sebaiknya gunakan enkripsi tambahan atau vault.
*/

CREATE TABLE IF NOT EXISTS ai_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  api_key text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  temperature numeric NOT NULL DEFAULT 0.7,
  max_tokens integer NOT NULL DEFAULT 2048,
  top_p numeric NOT NULL DEFAULT 0.9,
  expires_at date,
  expiry_auto_filled boolean NOT NULL DEFAULT false,
  saved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default rows untuk tiga provider
INSERT INTO ai_providers (provider, is_active, model)
VALUES ('claude', true, 'claude-3-5-sonnet-20241022'),
       ('gpt', false, 'gpt-4o'),
       ('gemini', false, 'gemini-1.5-pro')
ON CONFLICT DO NOTHING;

ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ai_providers" ON ai_providers;
CREATE POLICY "anon_select_ai_providers" ON ai_providers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ai_providers" ON ai_providers;
CREATE POLICY "anon_insert_ai_providers" ON ai_providers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ai_providers" ON ai_providers;
CREATE POLICY "anon_update_ai_providers" ON ai_providers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ai_providers" ON ai_providers;
CREATE POLICY "anon_delete_ai_providers" ON ai_providers FOR DELETE
  TO anon, authenticated USING (true);
