import { create } from "zustand";
import api from "@/lib/api";

interface AuthState {
  user: string | null;
  setUser: (user: string | null) => void;
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
      set({ user: response.data.username });
    } catch {
      set({ user: null });
    }
  },
}));

useAuthStore.getState().checkAuth();
