import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineAction {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  retries: number;
}

interface OfflineState {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  setOnline: (status: boolean) => void;
  addPendingAction: (type: string, payload: unknown) => void;
  removePendingAction: (id: string) => void;
  incrementRetry: (id: string) => void;
  clearPendingActions: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      isOnline: navigator.onLine,
      pendingActions: [],

      setOnline: (status) => set({ isOnline: status }),

      addPendingAction: (type, payload) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          pendingActions: [
            ...state.pendingActions,
            { id, type, payload, timestamp: Date.now(), retries: 0 },
          ],
        }));
      },

      removePendingAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter((a) => a.id !== id),
        }));
      },

      incrementRetry: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.map((a) =>
            a.id === id ? { ...a, retries: a.retries + 1 } : a
          ),
        }));
      },

      clearPendingActions: () => set({ pendingActions: [] }),
    }),
    {
      name: 'offline-storage',
    }
  )
);

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnline(false);
  });
}
