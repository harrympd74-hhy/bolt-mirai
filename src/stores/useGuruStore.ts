import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Teacher } from '@/types';

interface GuruState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  getById: (id: string) => Teacher | undefined;
  getByUsername: (username: string) => Teacher | undefined;
  create: (data: Omit<Teacher, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  update: (id: string, data: Partial<Teacher>) => Promise<{ error: string | null }>;
  remove: (id: string) => Promise<{ error: string | null }>;
}

export const useGuruStore = create<GuruState>((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('full_name');
    if (error) set({ error: error.message });
    else set({ teachers: data || [] });
    set({ loading: false });
  },

  getById: (id) => get().teachers.find((t) => t.id === id),
  getByUsername: (username) =>
    get().teachers.find((t) => t.username === username),

  create: async (data) => {
    const { error } = await supabase.from('teachers').insert(data);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  update: async (id, data) => {
    const { error } = await supabase.from('teachers').update(data).eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  remove: async (id) => {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },
}));
