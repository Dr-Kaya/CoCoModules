import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedModules: number[];
  currentModule: number | null;
  totalBadges: number;
  completeModule: (moduleId: number) => void;
  setCurrentModule: (moduleId: number | null) => void;
  isModuleCompleted: (moduleId: number) => boolean;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedModules: [],
      currentModule: null,
      totalBadges: 0,

      completeModule: (moduleId: number) => {
        const { completedModules } = get();
        if (!completedModules.includes(moduleId)) {
          set({
            completedModules: [...completedModules, moduleId],
            totalBadges: completedModules.length + 1,
          });
        }
      },

      setCurrentModule: (moduleId: number | null) => {
        set({ currentModule: moduleId });
      },

      isModuleCompleted: (moduleId: number) => {
        return get().completedModules.includes(moduleId);
      },

      resetProgress: () => {
        set({
          completedModules: [],
          currentModule: null,
          totalBadges: 0,
        });
      },
    }),
    {
      name: "ml-explorer-progress",
    }
  )
);
