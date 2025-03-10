import { create } from "zustand";
import Cookies from "js-cookie";
import api from "./api";

interface AuthState {
  user: { username: string; role: string } | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: Cookies.get("access_token") || null,
  login: async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      Cookies.set("access_token", response.data.access_token, { expires: 1 });
      Cookies.set("refresh_token", response.data.refresh_token, { expires: 30 });
      set({ user: { username, role: "user" }, accessToken: response.data.access_token });
      return true;
    } catch (error) {
      return false;
    }
  },
  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    set({ user: null, accessToken: null });
  },
}));
