// Barrel export untuk semua store MIRAI
export { useAuthStore, hasRole } from './useAuthStore';
export { useGuruStore } from './useGuruStore';
export { useKelasStore } from './useKelasStore';
export { useSiswaStore } from './useSiswaStore';
export { useAkademikStore } from './useAkademikStore';
export { usePengumumanStore } from './usePengumumanStore';

// Selectors tingkat tinggi (menggabungkan multiple store)
export {
  fetchAllData,
  getGuruDashboardStats,
  getGuruKelasWithRelations,
  getGuruScheduleToday,
  getGuruAllSchedules,
  getGuruAssignments,
  getGuruMaterials,
  getGuruSiswaByClass,
  getSiswaDashboardStats,
  getSiswaGrades,
  getSiswaAssignments,
  getSiswaSchedules,
  getSiswaMaterials,
  getOrtuDashboardStats,
  getAllKelasWithRelations,
  getAllSiswaWithKelas,
  getAllAnnouncementsWithAuthor,
} from './selectors';
