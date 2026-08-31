import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Student, StudentWithKelas } from '@/types';

interface SiswaState {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  getById: (id: string) => Student | undefined;
  getByUsername: (username: string) => Student | undefined;
  getByParentUsername: (parentUsername: string) => Student | undefined;
  /** Siswa dalam kelas tertentu */
  getByClass: (classId: string) => Student[];
  /** Siswa dengan nama kelas */
  getWithKelas: () => StudentWithKelas[];
  create: (data: Omit<Student, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  update: (id: string, data: Partial<Student>) => Promise<{ error: string | null }>;
  remove: (id: string) => Promise<{ error: string | null }>;
}

export const useSiswaStore = create<SiswaState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('full_name');
    if (error) set({ error: error.message });
    else set({ students: data || [] });
    set({ loading: false });
  },

  getById: (id) => get().students.find((s) => s.id === id),
  getByUsername: (username) =>
    get().students.find((s) => s.username === username),
  getByParentUsername: (parentUsername) =>
    get().students.find((s) => s.parent_username === parentUsername),

  getByClass: (classId) =>
    get().students.filter((s) => s.class_id === classId && s.is_active),

  getWithKelas: () => {
    const { students } = get();
    return students.map((s) => ({
      ...s,
      kelas_name: s.class_name,
    }));
  },

  create: async (data) => {
    const { error } = await supabase.from('students').insert(data);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  update: async (id, data) => {
    const { error } = await supabase.from('students').update(data).eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  remove: async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },
}));
