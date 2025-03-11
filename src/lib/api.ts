import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Включаем передачу куков при запросах
});

// ✅ Добавляем токен в заголовки, если он есть в куках
api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // 🔥 Бралось `access_token`, но в куках он называется `token`
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
