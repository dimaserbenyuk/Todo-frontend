import { create } from "zustand";
import api from "@/lib/api";

interface User {
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  
  setUser: (user) => set({ user }),

  login: async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });

      if (response.status === 200) {
        await useAuthStore.getState().checkAuth();
        return true;
      }

      return false;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await api.post("/logout");
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const response = await api.get("/me");
      set({ user: { username: response.data.username, role: response.data.role } });
    } catch {
      set({ user: null });
    }
  },
}));

// Проверка авторизации при загрузке страницы
useAuthStore.getState().checkAuth();
