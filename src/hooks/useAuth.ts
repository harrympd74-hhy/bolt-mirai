import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';


export type LoginResult =
  | { success: true; role: 'admin' | 'guru' | 'siswa' | 'ortu'; profile: { id: string; name: string; sub: string; teacherId?: string; studentId?: string; childStudentId?: string; classId?: string | null } }
  | { success: false; error: string };

// ============================================================
// Login Admin (hardcoded credential untuk super-admin)
// ============================================================
const ADMIN_USERNAME = 'hasanhadid';
const ADMIN_PASSWORD = 'hasanhadid68';

// ============================================================
// Hook: login yang cek database
// ============================================================
export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username: string, password: string, role: 'admin' | 'guru' | 'siswa' | 'ortu'): Promise<LoginResult> => {
    setLoading(true);
    try {
      // Admin login
      if (role === 'admin') {
        if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          return {
            success: true,
            role: 'admin',
            profile: { id: 'admin', name: 'Ahmad Rizki', sub: 'Pengelola Sistem MIRAI' },
          };
        }
        return { success: false, error: 'Username atau kata sandi admin salah.' };
      }

      // Guru login: cek tabel teachers
      if (role === 'guru') {
        const { data, error } = await supabase
          .from('teachers')
          .select('id, full_name, subject, username, password, is_active')
          .eq('username', username.trim())
          .maybeSingle();

        if (error) return { success: false, error: `Gagal menghubungi database: ${error.message}` };
        if (!data) return { success: false, error: 'Username guru tidak ditemukan.' };
        if (!data.is_active) return { success: false, error: 'Akun guru ini tidak aktif.' };
        if (data.password !== password) return { success: false, error: 'Kata sandi guru salah.' };

        return {
          success: true,
          role: 'guru',
          profile: {
            id: data.id,
            name: data.full_name,
            sub: `Guru ${data.subject || 'Pengajar'}`,
            teacherId: data.id,
          },
        };
      }

      // Siswa login: cek tabel students
      if (role === 'siswa') {
        const { data, error } = await supabase
          .from('students')
          .select('id, full_name, nis, class_name, class_id, username, password, is_active')
          .eq('username', username.trim())
          .maybeSingle();

        if (error) return { success: false, error: `Gagal menghubungi database: ${error.message}` };
        if (!data) return { success: false, error: 'Username siswa tidak ditemukan.' };
        if (!data.is_active) return { success: false, error: 'Akun siswa ini tidak aktif.' };
        if (data.password !== password) return { success: false, error: 'Kata sandi siswa salah.' };

        return {
          success: true,
          role: 'siswa',
          profile: {
            id: data.id,
            name: data.full_name,
            sub: `Kelas ${data.class_name || '-'} · NIS ${data.nis}`,
            studentId: data.id,
            classId: data.class_id,
          },
        };
      }

      // Orang Tua login: cek parent_username di tabel students
      if (role === 'ortu') {
        const { data, error } = await supabase
          .from('students')
          .select('id, full_name, class_name, class_id, parent_username, parent_password, is_active')
          .eq('parent_username', username.trim())
          .maybeSingle();

        if (error) return { success: false, error: `Gagal menghubungi database: ${error.message}` };
        if (!data) return { success: false, error: 'Username orang tua tidak ditemukan.' };
        if (!data.is_active) return { success: false, error: 'Akun siswa terkait tidak aktif.' };
        if (data.parent_password !== password) return { success: false, error: 'Kata sandi orang tua salah.' };

        return {
          success: true,
          role: 'ortu',
          profile: {
            id: data.id,
            name: `Wali ${data.full_name}`,
            sub: `Wali dari ${data.full_name} · Kelas ${data.class_name || '-'}`,
            childStudentId: data.id,
            classId: data.class_id,
          },
        };
      }

      return { success: false, error: 'Peran tidak dikenal.' };
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading };
}
