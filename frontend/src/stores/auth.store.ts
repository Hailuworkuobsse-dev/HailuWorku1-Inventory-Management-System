import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth.types';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  hasPermission: (permission: string) => boolean;
  markOnboardingComplete: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) => {
        console.log("Auth Store - Login called with user:", user);
        set({ 
          user: { 
            ...user, 
            onboardingComplete: user.onboardingComplete ?? false 
          },
          token, 
          refreshToken, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        const userId = get().user?.id;
        if (userId) {
          localStorage.removeItem(`onboarding-complete-${userId}`);
        }
        set({ 
          user: null, 
          token: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
      },

      setToken: (token: string) => set({ token }),

      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        return user.permissions?.includes(permission) ?? false;
      },

      markOnboardingComplete: async (userId: string) => {
        try {
          try {
            await api.patch(`/users/${userId}/onboarding-complete`, { onboardingComplete: true });
            console.log('Onboarding marked complete via API');
          } catch (apiError) {
            console.log('API endpoint not available, updating locally only');
          }
          
          set((state) => ({
            user: state.user ? { ...state.user, onboardingComplete: true } : null
          }));
          
          localStorage.setItem(`onboarding-complete-${userId}`, 'true');
          
        } catch (error) {
          console.error('Failed to mark onboarding as complete:', error);
          set((state) => ({
            user: state.user ? { ...state.user, onboardingComplete: true } : null
          }));
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
