import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Передаем токен
  }
  return config;
});

export default api;
