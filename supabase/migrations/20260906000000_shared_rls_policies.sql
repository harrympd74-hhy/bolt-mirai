-- ============================================================
-- Shared-access RLS policies (USING(true))
-- Diterapkan: 2026-09-06
-- Aturan shared-data: akses terbuka untuk semua peran (shared monolitik).
-- service_role tetap bypass RLS; backend function tidak terpengaruh.
-- ============================================================
ALTER TABLE public.admin_ai_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_ai_config ON public.admin_ai_config;
DROP POLICY IF EXISTS shared_insert_admin_ai_config ON public.admin_ai_config;
DROP POLICY IF EXISTS shared_update_admin_ai_config ON public.admin_ai_config;
DROP POLICY IF EXISTS shared_delete_admin_ai_config ON public.admin_ai_config;
CREATE POLICY shared_select_admin_ai_config ON public.admin_ai_config FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_ai_config ON public.admin_ai_config FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_ai_config ON public.admin_ai_config FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_ai_config ON public.admin_ai_config FOR DELETE USING (true);

ALTER TABLE public.admin_gurus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_gurus ON public.admin_gurus;
DROP POLICY IF EXISTS shared_insert_admin_gurus ON public.admin_gurus;
DROP POLICY IF EXISTS shared_update_admin_gurus ON public.admin_gurus;
DROP POLICY IF EXISTS shared_delete_admin_gurus ON public.admin_gurus;
CREATE POLICY shared_select_admin_gurus ON public.admin_gurus FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_gurus ON public.admin_gurus FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_gurus ON public.admin_gurus FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_gurus ON public.admin_gurus FOR DELETE USING (true);

ALTER TABLE public.admin_jadwals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_jadwals ON public.admin_jadwals;
DROP POLICY IF EXISTS shared_insert_admin_jadwals ON public.admin_jadwals;
DROP POLICY IF EXISTS shared_update_admin_jadwals ON public.admin_jadwals;
DROP POLICY IF EXISTS shared_delete_admin_jadwals ON public.admin_jadwals;
CREATE POLICY shared_select_admin_jadwals ON public.admin_jadwals FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_jadwals ON public.admin_jadwals FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_jadwals ON public.admin_jadwals FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_jadwals ON public.admin_jadwals FOR DELETE USING (true);

ALTER TABLE public.admin_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_profile ON public.admin_profile;
DROP POLICY IF EXISTS shared_insert_admin_profile ON public.admin_profile;
DROP POLICY IF EXISTS shared_update_admin_profile ON public.admin_profile;
DROP POLICY IF EXISTS shared_delete_admin_profile ON public.admin_profile;
CREATE POLICY shared_select_admin_profile ON public.admin_profile FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_profile ON public.admin_profile FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_profile ON public.admin_profile FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_profile ON public.admin_profile FOR DELETE USING (true);

ALTER TABLE public.admin_siswas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_siswas ON public.admin_siswas;
DROP POLICY IF EXISTS shared_insert_admin_siswas ON public.admin_siswas;
DROP POLICY IF EXISTS shared_update_admin_siswas ON public.admin_siswas;
DROP POLICY IF EXISTS shared_delete_admin_siswas ON public.admin_siswas;
CREATE POLICY shared_select_admin_siswas ON public.admin_siswas FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_siswas ON public.admin_siswas FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_siswas ON public.admin_siswas FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_siswas ON public.admin_siswas FOR DELETE USING (true);

ALTER TABLE public.admin_ujians ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_admin_ujians ON public.admin_ujians;
DROP POLICY IF EXISTS shared_insert_admin_ujians ON public.admin_ujians;
DROP POLICY IF EXISTS shared_update_admin_ujians ON public.admin_ujians;
DROP POLICY IF EXISTS shared_delete_admin_ujians ON public.admin_ujians;
CREATE POLICY shared_select_admin_ujians ON public.admin_ujians FOR SELECT USING (true);
CREATE POLICY shared_insert_admin_ujians ON public.admin_ujians FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_admin_ujians ON public.admin_ujians FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_admin_ujians ON public.admin_ujians FOR DELETE USING (true);

ALTER TABLE public.app_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_app_info ON public.app_info;
DROP POLICY IF EXISTS shared_insert_app_info ON public.app_info;
DROP POLICY IF EXISTS shared_update_app_info ON public.app_info;
DROP POLICY IF EXISTS shared_delete_app_info ON public.app_info;
CREATE POLICY shared_select_app_info ON public.app_info FOR SELECT USING (true);
CREATE POLICY shared_insert_app_info ON public.app_info FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_app_info ON public.app_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_app_info ON public.app_info FOR DELETE USING (true);

ALTER TABLE public.guru_pertemuan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_guru_pertemuan ON public.guru_pertemuan;
DROP POLICY IF EXISTS shared_insert_guru_pertemuan ON public.guru_pertemuan;
DROP POLICY IF EXISTS shared_update_guru_pertemuan ON public.guru_pertemuan;
DROP POLICY IF EXISTS shared_delete_guru_pertemuan ON public.guru_pertemuan;
CREATE POLICY shared_select_guru_pertemuan ON public.guru_pertemuan FOR SELECT USING (true);
CREATE POLICY shared_insert_guru_pertemuan ON public.guru_pertemuan FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_guru_pertemuan ON public.guru_pertemuan FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_guru_pertemuan ON public.guru_pertemuan FOR DELETE USING (true);

ALTER TABLE public.guru_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_guru_profile ON public.guru_profile;
DROP POLICY IF EXISTS shared_insert_guru_profile ON public.guru_profile;
DROP POLICY IF EXISTS shared_update_guru_profile ON public.guru_profile;
DROP POLICY IF EXISTS shared_delete_guru_profile ON public.guru_profile;
CREATE POLICY shared_select_guru_profile ON public.guru_profile FOR SELECT USING (true);
CREATE POLICY shared_insert_guru_profile ON public.guru_profile FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_guru_profile ON public.guru_profile FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_guru_profile ON public.guru_profile FOR DELETE USING (true);

ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_repositories ON public.repositories;
DROP POLICY IF EXISTS shared_insert_repositories ON public.repositories;
DROP POLICY IF EXISTS shared_update_repositories ON public.repositories;
DROP POLICY IF EXISTS shared_delete_repositories ON public.repositories;
CREATE POLICY shared_select_repositories ON public.repositories FOR SELECT USING (true);
CREATE POLICY shared_insert_repositories ON public.repositories FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_repositories ON public.repositories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_repositories ON public.repositories FOR DELETE USING (true);

ALTER TABLE public.struggle_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shared_select_struggle_scores ON public.struggle_scores;
DROP POLICY IF EXISTS shared_insert_struggle_scores ON public.struggle_scores;
DROP POLICY IF EXISTS shared_update_struggle_scores ON public.struggle_scores;
DROP POLICY IF EXISTS shared_delete_struggle_scores ON public.struggle_scores;
CREATE POLICY shared_select_struggle_scores ON public.struggle_scores FOR SELECT USING (true);
CREATE POLICY shared_insert_struggle_scores ON public.struggle_scores FOR INSERT WITH CHECK (true);
CREATE POLICY shared_update_struggle_scores ON public.struggle_scores FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY shared_delete_struggle_scores ON public.struggle_scores FOR DELETE USING (true);

