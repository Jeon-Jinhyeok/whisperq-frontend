import { create } from 'zustand';
import type { ReactionType, ReactionCount } from '@/types';

interface ReactionState {
  // State
  recentReactions: ReactionCount;
  intensity: number; // 0-100 for glow effect
  dominantType: ReactionType | null;

  // Actions
  updateReactions: (type: ReactionType, count: number, intensity: number) => void;
  resetReactions: () => void;
}

export const useReactionStore = create<ReactionState>((set) => ({
  // Initial state
  recentReactions: { confused: 0, more: 0 },
  intensity: 0,
  dominantType: null,

  // Actions
  updateReactions: (type, count, intensity) =>
    set((state) => {
      const newReactions = {
        ...state.recentReactions,
        [type]: count,
      };

      // Determine dominant reaction type
      let dominant: ReactionType | null = null;
      if (newReactions.confused > newReactions.more) {
        dominant = 'confused';
      } else if (newReactions.more > newReactions.confused) {
        dominant = 'more';
      }

      return {
        recentReactions: newReactions,
        intensity,
        dominantType: dominant,
      };
    }),

  resetReactions: () =>
    set({
      recentReactions: { confused: 0, more: 0 },
      intensity: 0,
      dominantType: null,
    }),
}));
