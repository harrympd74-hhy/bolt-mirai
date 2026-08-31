import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type {
  Schedule, Assignment, Grade, Attendance, Material,
} from '@/types';

interface AkademikState {
  schedules: Schedule[];
  assignments: Assignment[];
  grades: Grade[];
  attendance: Attendance[];
  materials: Material[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  fetchAssignments: () => Promise<void>;
  fetchGrades: () => Promise<void>;
  fetchAttendance: () => Promise<void>;
  fetchMaterials: () => Promise<void>;

  // Schedule selectors
  getScheduleByTeacher: (teacherId: string) => Schedule[];
  getScheduleByClass: (classId: string) => Schedule[];
  getScheduleToday: (teacherId: string, day: string) => Schedule[];

  // Assignment selectors
  getAssignmentByTeacher: (teacherId: string) => Assignment[];
  getAssignmentByClass: (classId: string) => Assignment[];
  getAssignmentByStudent: (studentId: string, classId: string) => Assignment[];

  // Grade selectors
  getGradeByStudent: (studentId: string) => Grade[];
  getGradeByAssignment: (assignmentId: string) => Grade[];
  getGradeByClass: (classId: string) => Grade[];

  // Attendance selectors
  getAttendanceByStudent: (studentId: string) => Attendance[];
  getAttendanceByClass: (classId: string, date?: string) => Attendance[];

  // Material selectors
  getMaterialByTeacher: (teacherId: string) => Material[];
  getMaterialByClass: (classId: string) => Material[];

  // CRUD - Schedule
  createSchedule: (data: Omit<Schedule, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateSchedule: (id: string, data: Partial<Schedule>) => Promise<{ error: string | null }>;
  removeSchedule: (id: string) => Promise<{ error: string | null }>;

  // CRUD - Assignment
  createAssignment: (data: Omit<Assignment, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<{ error: string | null }>;
  removeAssignment: (id: string) => Promise<{ error: string | null }>;

  // CRUD - Grade
  createGrade: (data: Omit<Grade, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateGrade: (id: string, data: Partial<Grade>) => Promise<{ error: string | null }>;
  removeGrade: (id: string) => Promise<{ error: string | null }>;

  // CRUD - Attendance
  createAttendance: (data: Omit<Attendance, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateAttendance: (id: string, data: Partial<Attendance>) => Promise<{ error: string | null }>;
  removeAttendance: (id: string) => Promise<{ error: string | null }>;

  // CRUD - Material
  createMaterial: (data: Omit<Material, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateMaterial: (id: string, data: Partial<Material>) => Promise<{ error: string | null }>;
  removeMaterial: (id: string) => Promise<{ error: string | null }>;
}

export const useAkademikStore = create<AkademikState>((set, get) => ({
  schedules: [],
  assignments: [],
  grades: [],
  attendance: [],
  materials: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    await Promise.all([
      get().fetchSchedules(),
      get().fetchAssignments(),
      get().fetchGrades(),
      get().fetchAttendance(),
      get().fetchMaterials(),
    ]);
    set({ loading: false });
  },

  fetchSchedules: async () => {
    const { data, error } = await supabase.from('schedules').select('*').order('day', { ascending: true });
    if (error) set({ error: error.message });
    else set({ schedules: data || [] });
  },

  fetchAssignments: async () => {
    const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    if (error) set({ error: error.message });
    else set({ assignments: data || [] });
  },

  fetchGrades: async () => {
    const { data, error } = await supabase.from('grades').select('*').order('date', { ascending: false });
    if (error) set({ error: error.message });
    else set({ grades: data || [] });
  },

  fetchAttendance: async () => {
    const { data, error } = await supabase.from('attendance').select('*').order('date', { ascending: false });
    if (error) set({ error: error.message });
    else set({ attendance: data || [] });
  },

  fetchMaterials: async () => {
    const { data, error } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
    if (error) set({ error: error.message });
    else set({ materials: data || [] });
  },

  // --- Schedule selectors ---
  getScheduleByTeacher: (teacherId) =>
    get().schedules.filter((s) => s.teacher_id === teacherId),
  getScheduleByClass: (classId) =>
    get().schedules.filter((s) => s.class_id === classId),
  getScheduleToday: (teacherId, day) =>
    get().schedules.filter((s) => s.teacher_id === teacherId && s.day === day),

  // --- Assignment selectors ---
  getAssignmentByTeacher: (teacherId) =>
    get().assignments.filter((a) => a.teacher_id === teacherId),
  getAssignmentByClass: (classId) =>
    get().assignments.filter((a) => a.class_id === classId),
  getAssignmentByStudent: (_studentId, classId) =>
    get().assignments.filter((a) => a.class_id === classId && a.status === 'active'),

  // --- Grade selectors ---
  getGradeByStudent: (studentId) =>
    get().grades.filter((g) => g.student_id === studentId),
  getGradeByAssignment: (assignmentId) =>
    get().grades.filter((g) => g.assignment_id === assignmentId),
  getGradeByClass: (classId) => {
    // Grade tidak punya class_id langsung; kita filter via assignment
    const assignmentIds = get().assignments
      .filter((a) => a.class_id === classId)
      .map((a) => a.id);
    return get().grades.filter(
      (g) => g.assignment_id !== null && assignmentIds.includes(g.assignment_id)
    );
  },

  // --- Attendance selectors ---
  getAttendanceByStudent: (studentId) =>
    get().attendance.filter((a) => a.student_id === studentId),
  getAttendanceByClass: (classId, date) =>
    get().attendance.filter(
      (a) => a.class_id === classId && (date === undefined || a.date === date)
    ),

  // --- Material selectors ---
  getMaterialByTeacher: (teacherId) =>
    get().materials.filter((m) => m.teacher_id === teacherId),
  getMaterialByClass: (classId) =>
    get().materials.filter((m) => m.class_id === classId),

  // --- CRUD Schedule ---
  createSchedule: async (data) => {
    const { error } = await supabase.from('schedules').insert(data);
    if (!error) await get().fetchSchedules();
    return { error: error?.message ?? null };
  },
  updateSchedule: async (id, data) => {
    const { error } = await supabase.from('schedules').update(data).eq('id', id);
    if (!error) await get().fetchSchedules();
    return { error: error?.message ?? null };
  },
  removeSchedule: async (id) => {
    const { error } = await supabase.from('schedules').delete().eq('id', id);
    if (!error) await get().fetchSchedules();
    return { error: error?.message ?? null };
  },

  // --- CRUD Assignment ---
  createAssignment: async (data) => {
    const { error } = await supabase.from('assignments').insert(data);
    if (!error) await get().fetchAssignments();
    return { error: error?.message ?? null };
  },
  updateAssignment: async (id, data) => {
    const { error } = await supabase.from('assignments').update(data).eq('id', id);
    if (!error) await get().fetchAssignments();
    return { error: error?.message ?? null };
  },
  removeAssignment: async (id) => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (!error) await get().fetchAssignments();
    return { error: error?.message ?? null };
  },

  // --- CRUD Grade ---
  createGrade: async (data) => {
    const { error } = await supabase.from('grades').insert(data);
    if (!error) await get().fetchGrades();
    return { error: error?.message ?? null };
  },
  updateGrade: async (id, data) => {
    const { error } = await supabase.from('grades').update(data).eq('id', id);
    if (!error) await get().fetchGrades();
    return { error: error?.message ?? null };
  },
  removeGrade: async (id) => {
    const { error } = await supabase.from('grades').delete().eq('id', id);
    if (!error) await get().fetchGrades();
    return { error: error?.message ?? null };
  },

  // --- CRUD Attendance ---
  createAttendance: async (data) => {
    const { error } = await supabase.from('attendance').insert(data);
    if (!error) await get().fetchAttendance();
    return { error: error?.message ?? null };
  },
  updateAttendance: async (id, data) => {
    const { error } = await supabase.from('attendance').update(data).eq('id', id);
    if (!error) await get().fetchAttendance();
    return { error: error?.message ?? null };
  },
  removeAttendance: async (id) => {
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (!error) await get().fetchAttendance();
    return { error: error?.message ?? null };
  },

  // --- CRUD Material ---
  createMaterial: async (data) => {
    const { error } = await supabase.from('materials').insert(data);
    if (!error) await get().fetchMaterials();
    return { error: error?.message ?? null };
  },
  updateMaterial: async (id, data) => {
    const { error } = await supabase.from('materials').update(data).eq('id', id);
    if (!error) await get().fetchMaterials();
    return { error: error?.message ?? null };
  },
  removeMaterial: async (id) => {
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (!error) await get().fetchMaterials();
    return { error: error?.message ?? null };
  },
}));
