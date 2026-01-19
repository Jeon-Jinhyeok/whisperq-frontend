import { create } from 'zustand';
import type { Session } from '@/types';

interface SessionState {
  // State
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Initial state
  currentSession: null,
  isLoading: false,
  error: null,

  // Actions
  setSession: (session) => set({ currentSession: session, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearSession: () => set({ currentSession: null, error: null }),
}));
