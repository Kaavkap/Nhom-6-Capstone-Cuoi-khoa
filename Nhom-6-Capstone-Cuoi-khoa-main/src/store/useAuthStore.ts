import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      accessToken: null,
      setAuth: (user) => {
        set({ currentUser: user, accessToken: user.accessToken || null });
        if (user.accessToken) {
          localStorage.setItem('accessToken', user.accessToken);
        }
      },
      logout: () => {
        set({ currentUser: null, accessToken: null });
        localStorage.removeItem('accessToken');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
