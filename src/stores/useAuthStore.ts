import { create } from 'zustand';
import type { AuthUser, Role } from '@/types';

interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  isAuthenticated: () => get().user !== null,
}));

/** Helper: cek apakah user saat ini memiliki salah satu role */
export function hasRole(...roles: Role[]): boolean {
  const user = useAuthStore.getState().user;
  return user !== null && roles.includes(user.role);
}
