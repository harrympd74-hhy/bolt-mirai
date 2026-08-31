import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Announcement, AnnouncementWithAuthor, Role } from '@/types';

interface PengumumanState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  /** Pengumuman untuk role tertentu (filter berdasarkan target) */
  getForRole: (role: Role, classId?: string | null) => Announcement[];
  /** Pengumuman dengan info pembuat */
  getWithAuthor: () => AnnouncementWithAuthor[];
  create: (data: Omit<Announcement, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  update: (id: string, data: Partial<Announcement>) => Promise<{ error: string | null }>;
  remove: (id: string) => Promise<{ error: string | null }>;
}

export const usePengumumanStore = create<PengumumanState>((set, get) => ({
  announcements: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) set({ error: error.message });
    else set({ announcements: data || [] });
    set({ loading: false });
  },

  getForRole: (role, classId) => {
    const { announcements } = get();
    return announcements.filter((a) => {
      if (a.target === 'all') return true;
      if (a.target === 'class' && classId) return a.target_class_id === classId;
      return false;
    });
  },

  getWithAuthor: () => {
    const { announcements } = get();
    return announcements.map((a) => ({
      ...a,
      author_name: '', // diisi oleh selector yang punya akses guru/admin store
      target_class_name: null,
    }));
  },

  create: async (data) => {
    const { error } = await supabase.from('announcements').insert(data);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  update: async (id, data) => {
    const { error } = await supabase.from('announcements').update(data).eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  remove: async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },
}));
