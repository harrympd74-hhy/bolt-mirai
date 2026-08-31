import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Kelas, TeacherClass, KelasWithRelations } from '@/types';

interface KelasState {
  classes: Kelas[];
  teacherClasses: TeacherClass[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  getById: (id: string) => Kelas | undefined;
  /** Kelas yang diampu guru tertentu (via teacher_classes junction) */
  getByTeacher: (teacherId: string) => Kelas[];
  /** Semua kelas dengan relasi wali kelas + jumlah siswa + jumlah guru */
  getWithRelations: () => KelasWithRelations[];
  /** Assign guru ke kelas */
  assignTeacher: (teacherId: string, classId: string, subject?: string) => Promise<{ error: string | null }>;
  /** Unassign guru dari kelas */
  unassignTeacher: (teacherId: string, classId: string) => Promise<{ error: string | null }>;
  create: (data: Omit<Kelas, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  update: (id: string, data: Partial<Kelas>) => Promise<{ error: string | null }>;
  remove: (id: string) => Promise<{ error: string | null }>;
}

export const useKelasStore = create<KelasState>((set, get) => ({
  classes: [],
  teacherClasses: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    const [classRes, tcRes] = await Promise.all([
      supabase.from('classes').select('*').order('name'),
      supabase.from('teacher_classes').select('*'),
    ]);
    if (classRes.error) set({ error: classRes.error.message });
    else set({ classes: classRes.data || [] });
    if (tcRes.error) set({ error: tcRes.error.message });
    else set({ teacherClasses: tcRes.data || [] });
    set({ loading: false });
  },

  getById: (id) => get().classes.find((c) => c.id === id),

  getByTeacher: (teacherId) => {
    const { teacherClasses, classes } = get();
    const classIds = teacherClasses
      .filter((tc) => tc.teacher_id === teacherId)
      .map((tc) => tc.class_id);
    return classes.filter((c) => classIds.includes(c.id));
  },

  getWithRelations: () => {
    const { classes, teacherClasses } = get();
    // Untuk menghitung jumlah siswa per kelas, kita butuh data siswa
    // tapi untuk menghindari circular dependency, kita hitung dari students store
    // di selector level. Di sini kita berikan yang bisa dihitung dari store ini.
    return classes.map((c) => ({
      ...c,
      wali_kelas_name: null, // diisi oleh selector yang punya akses teacher store
      student_count: 0, // diisi oleh selector yang punya akses siswa store
      teacher_count: teacherClasses.filter((tc) => tc.class_id === c.id).length,
    }));
  },

  assignTeacher: async (teacherId, classId, subject) => {
    const { error } = await supabase
      .from('teacher_classes')
      .insert({ teacher_id: teacherId, class_id: classId, subject });
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  unassignTeacher: async (teacherId, classId) => {
    const { error } = await supabase
      .from('teacher_classes')
      .delete()
      .eq('teacher_id', teacherId)
      .eq('class_id', classId);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  create: async (data) => {
    const { error } = await supabase.from('classes').insert(data);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  update: async (id, data) => {
    const { error } = await supabase.from('classes').update(data).eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },

  remove: async (id) => {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (!error) await get().fetchAll();
    return { error: error?.message ?? null };
  },
}));
