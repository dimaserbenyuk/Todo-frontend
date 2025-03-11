"use client";

import { create } from "zustand";

interface AuthState {
  user: string | null;
  setUser: (user: string | null) => void;
  login: (username: string, password: string, onLoginSuccess?: () => void) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  login: async (username, password, onLoginSuccess) => {
    const response = await fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // 🔥 Передаем cookies
    });

    if (response.ok) {
      set({ user: username });

      // ✅ Гарантированно вызываем onLoginSuccess только после установки user
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      return true;
    } else {
      return false;
    }
  },

  logout: async () => {
    await fetch("http://localhost:8080/api/v1/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ user: null });
  },

  checkAuth: async () => {
    const response = await fetch("http://localhost:8080/api/v1/me", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      set({ user: data.username });
    } else {
      set({ user: null });
    }
  },
}));

// ⚡ Автоматическая проверка авторизации при загрузке страницы
useAuthStore.getState().checkAuth();
