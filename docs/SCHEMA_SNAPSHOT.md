# Skema Database MIRAI — Snapshot

Diperbarui: 2026-09-06  (otomatis dari Supabase project ref `lbfmwscawbkqwbiqwwpy`)

## Status RLS

| Tabel | RLS | Jumlah Policy |
|---|:--:|:--:|
| admin_ai_config | ❌ | undefined |
| admin_gurus | ❌ | undefined |
| admin_jadwals | ❌ | undefined |
| admin_profile | ❌ | undefined |
| admin_siswas | ❌ | undefined |
| admin_ujians | ❌ | undefined |
| ai_providers | ❌ | undefined |
| announcements | ❌ | undefined |
| app_info | ❌ | undefined |
| assignments | ❌ | undefined |
| attendance | ❌ | undefined |
| class_meetings | ❌ | undefined |
| class_preparations | ❌ | undefined |
| classes | ❌ | undefined |
| grades | ❌ | undefined |
| guru_pertemuan | ❌ | undefined |
| guru_profile | ❌ | undefined |
| materials | ❌ | undefined |
| meeting_assignments | ❌ | undefined |
| meeting_materials | ❌ | undefined |
| question_banks | ❌ | undefined |
| repositories | ❌ | undefined |
| schedules | ❌ | undefined |
| struggle_scores | ❌ | undefined |
| students | ❌ | undefined |
| surveys | ❌ | undefined |
| teacher_classes | ❌ | undefined |
| teachers | ❌ | undefined |
| teaching_materials | ❌ | undefined |

## Kolom per Tabel

### admin_ai_config

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| model | text | NO | 'gemini_3_flash'::text |
| api_key | text | YES | ''::text |
| temperature | numeric | YES | 0.7 |
| ai_tutor | boolean | YES | true |
| auto_grading | boolean | YES | true |
| content_generation | boolean | YES | false |
| student_analytics | boolean | YES | true |
| saved_at | timestamp with time zone | YES | now() |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### admin_gurus

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| nama | text | NO |  |
| nip | text | YES | '-'::text |
| jenis_kelamin | text | YES | 'Laki-laki'::text |
| mapel | text | YES | ''::text |
| jenis | text | NO | 'tetap'::text |
| telepon | text | YES | ''::text |
| email | text | YES | ''::text |
| alamat | text | YES | ''::text |
| tanggal_bergabung | date | YES |  |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### admin_jadwals

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| kelas | text | NO |  |
| mapel | text | NO |  |
| guru | text | YES | ''::text |
| hari | text | NO |  |
| jam_mulai | text | NO |  |
| jam_selesai | text | NO |  |
| ruang | text | YES | ''::text |
| semester | text | YES | 'Ganjil 2025/2026'::text |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### admin_profile

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| nama | text | NO | 'Ahmad Rizki'::text |
| email | text | YES | 'ahmad.rizki@mirai.sch.id'::text |
| telepon | text | YES | ''::text |
| jabatan | text | YES | 'Pengelola Sistem MIRAI'::text |
| alamat | text | YES | 'Bandung, Jawa Barat'::text |
| updated_at | timestamp with time zone | NO | now() |

### admin_siswas

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| nama | text | NO |  |
| nisn | text | YES | ''::text |
| kelas | text | YES | ''::text |
| jenis_kelamin | text | YES | 'Laki-laki'::text |
| tanggal_lahir | date | YES |  |
| alamat | text | YES | ''::text |
| nama_ortu | text | YES | ''::text |
| telepon_ortu | text | YES | ''::text |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### admin_ujians

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| jenis | text | NO |  |
| mapel | text | NO |  |
| kelas | text | NO |  |
| tanggal | date | NO |  |
| jam_mulai | text | NO |  |
| jam_selesai | text | NO |  |
| ruang | text | YES | ''::text |
| durasi | integer | YES | 90 |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### ai_providers

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| provider | text | NO |  |
| is_active | boolean | NO | false |
| api_key | text | NO | ''::text |
| model | text | NO | ''::text |
| temperature | numeric | NO | 0.7 |
| max_tokens | integer | NO | 2048 |
| top_p | numeric | NO | 0.9 |
| expires_at | date | YES |  |
| expiry_auto_filled | boolean | NO | false |
| saved_at | timestamp with time zone | YES |  |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

### announcements

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| created_by | uuid | YES |  |
| author_role | text | NO | 'admin'::text |
| target | text | NO | 'all'::text |
| target_class_id | uuid | YES |  |
| title | text | NO |  |
| content | text | NO |  |
| is_pinned | boolean | NO | false |
| created_at | timestamp with time zone | YES | now() |

### app_info

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | text | NO |  |
| app_name | text | NO |  |
| description | text | YES |  |
| version | text | YES |  |
| website | text | YES |  |
| created_date | timestamp with time zone | YES | now() |

### assignments

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| title | text | NO |  |
| description | text | YES |  |
| subject | text | NO |  |
| deadline | timestamp with time zone | YES |  |
| status | text | NO | 'active'::text |
| created_at | timestamp with time zone | YES | now() |

### attendance

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | NO |  |
| class_id | uuid | NO |  |
| date | date | NO |  |
| status | text | NO | 'hadir'::text |
| note | text | YES |  |
| created_at | timestamp with time zone | YES | now() |

### class_meetings

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| schedule_id | uuid | YES |  |
| meeting_number | integer | NO | 1 |
| title | text | NO |  |
| meeting_date | date | NO |  |
| start_time | time without time zone | NO |  |
| end_time | time without time zone | NO |  |
| locked | boolean | NO | false |
| completed | boolean | NO | false |
| partially_completed | boolean | NO | false |
| notes | text | YES |  |
| created_at | timestamp with time zone | YES | now() |

### class_preparations

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| schedule_id | uuid | YES |  |
| material_id | uuid | YES |  |
| question_bank_id | uuid | YES |  |
| survey_id | uuid | YES |  |
| title | text | NO |  |
| notes | text | YES |  |
| preparation_date | date | NO | CURRENT_DATE |
| created_at | timestamp with time zone | YES | now() |

### classes

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO |  |
| grade | integer | NO | 7 |
| wali_kelas_id | uuid | YES |  |
| academic_year | text | NO | '2025/2026'::text |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES | now() |

### grades

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | NO |  |
| assignment_id | uuid | YES |  |
| teacher_id | uuid | YES |  |
| subject | text | NO |  |
| assessment_type | text | NO | 'tugas'::text |
| score | numeric | NO |  |
| max_score | numeric | NO | 100 |
| date | timestamp with time zone | YES | now() |
| created_at | timestamp with time zone | YES | now() |

### guru_pertemuan

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| created_by_id | text | YES |  |
| meeting_number | integer | YES |  |
| class_name | text | YES |  |
| title | text | YES |  |
| starts_at | timestamp with time zone | YES |  |
| ends_at | timestamp with time zone | YES |  |
| status | text | YES | 'published'::text |
| materials | jsonb | YES | '[]'::jsonb |
| assignments | jsonb | YES | '[]'::jsonb |
| updated_at | timestamp with time zone | YES | now() |

### guru_profile

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| created_by_id | text | YES |  |
| nama_lengkap | text | YES |  |
| nip | text | YES |  |
| nik | text | YES |  |
| tempat_lahir | text | YES |  |
| tanggal_lahir | date | YES |  |
| jenis_kelamin | text | YES |  |
| agama | text | YES |  |
| status_pernikahan | text | YES |  |
| alamat | text | YES |  |
| kota | text | YES |  |
| provinsi | text | YES |  |
| telepon | text | YES |  |
| email | text | YES |  |
| nuptk | text | YES |  |
| status_kepegawaian | text | YES |  |
| golongan | text | YES |  |
| tmt | date | YES |  |
| unit_kerja | text | YES |  |
| jabatan | text | YES |  |
| pendidikan_terakhir | text | YES |  |
| jurusan | text | YES |  |
| universitas | text | YES |  |
| tahun_lulus | text | YES |  |
| mata_pelajaran | text | YES |  |
| kelas_ampu | text | YES |  |
| beban_mengajar | text | YES |  |
| wali_kelas | text | YES |  |
| status_sertifikasi | text | YES |  |
| no_sertifikat | text | YES |  |
| tahun_sertifikasi | text | YES |  |
| bidang_sertifikasi | text | YES |  |
| foto_url | text | YES |  |
| updated_at | timestamp with time zone | YES | now() |

### materials

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| title | text | NO |  |
| description | text | YES |  |
| subject | text | NO |  |
| content_url | text | YES |  |
| file_type | text | YES | 'pdf'::text |
| created_at | timestamp with time zone | YES | now() |

### meeting_assignments

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| meeting_id | uuid | NO |  |
| title | text | NO |  |
| description | text | YES |  |
| deadline | timestamp with time zone | YES |  |
| created_at | timestamp with time zone | YES | now() |

### meeting_materials

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| meeting_id | uuid | NO |  |
| type | text | NO | 'file'::text |
| title | text | NO |  |
| file_url | text | YES |  |
| file_type | text | YES |  |
| file_size | bigint | YES |  |
| external_url | text | YES |  |
| created_at | timestamp with time zone | YES | now() |

### question_banks

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | YES |  |
| title | text | NO |  |
| subject | text | NO |  |
| description | text | YES |  |
| questions | jsonb | NO | '[]'::jsonb |
| created_at | timestamp with time zone | YES | now() |

### repositories

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | text | NO |  |
| repo_id | bigint | NO |  |
| name | text | NO |  |
| full_name | text | YES |  |
| description | text | YES |  |
| html_url | text | NO |  |
| language | text | YES |  |
| stars | integer | YES | 0 |
| forks | integer | YES | 0 |
| issues | integer | YES | 0 |
| visibility | text | YES |  |
| updated_at | timestamp with time zone | YES |  |
| created_date | timestamp with time zone | YES | now() |

### schedules

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| subject | text | NO |  |
| day | text | NO |  |
| start_time | time without time zone | NO |  |
| end_time | time without time zone | NO |  |
| room | text | YES |  |
| created_at | timestamp with time zone | YES | now() |

### struggle_scores

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| siswa_nama | text | NO |  |
| kelas | text | NO |  |
| mapel | text | NO |  |
| topik | text | NO |  |
| soal_id | integer | YES |  |
| soal_judul | text | YES |  |
| score | integer | NO |  |
| aspects | jsonb | YES |  |
| attempts | integer | YES | 0 |
| direction_changes | integer | YES | 0 |
| hints | integer | YES | 0 |
| time_seconds | integer | YES | 0 |
| status | text | YES | 'menunggu'::text |
| created_at | timestamp with time zone | YES | now() |

### students

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| nis | text | NO |  |
| full_name | text | NO |  |
| email | text | YES |  |
| phone | text | YES |  |
| class_name | text | YES |  |
| gender | text | YES | 'L'::text |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| username | text | YES |  |
| password | text | YES |  |
| parent_username | text | YES |  |
| parent_password | text | YES |  |
| class_id | uuid | YES |  |

### surveys

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | YES |  |
| title | text | NO |  |
| description | text | YES |  |
| questions | jsonb | NO | '[]'::jsonb |
| created_at | timestamp with time zone | YES | now() |

### teacher_classes

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | NO |  |
| subject | text | YES |  |
| created_at | timestamp with time zone | YES | now() |

### teachers

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| nip | text | NO |  |
| full_name | text | NO |  |
| email | text | YES |  |
| phone | text | YES |  |
| subject | text | YES |  |
| gender | text | YES | 'L'::text |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| username | text | YES |  |
| password | text | YES |  |

### teaching_materials

| Kolom | Tipe | Null | Default |
|---|---|:--:|---|
| id | uuid | NO | gen_random_uuid() |
| teacher_id | uuid | NO |  |
| class_id | uuid | YES |  |
| title | text | NO |  |
| subject | text | NO |  |
| description | text | YES |  |
| content | text | YES |  |
| file_url | text | YES |  |
| file_type | text | YES | 'pdf'::text |
| created_at | timestamp with time zone | YES | now() |
| topic | text | YES |  |
| learning_objectives | text | YES |  |
| tags | text | YES |  |
| material_type | text | YES | 'document'::text |
| thumbnail_url | text | YES |  |
| label_color | text | YES | 'blue'::text |
| access_level | text | YES | 'class'::text |
| is_published | boolean | YES | false |
| is_favorite | boolean | YES | false |
| allow_comments | boolean | YES | true |
| notify_students | boolean | YES | false |
| file_size | bigint | YES |  |
| status | text | YES | 'draft'::text |

