"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Уведомления

export default function LoginPage() {
  const { login, checkAuth } = useAuthStore(); // ✅ Добавил checkAuth
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Очистка ошибок перед новым запросом
    setLoading(true);

    try {
      const success = await login(form.username, form.password);

      if (success) {
        await checkAuth(); // ✅ Теперь статус пользователя обновится!
        toast.success("Вход выполнен!", { description: `Добро пожаловать, ${form.username}!` });
        router.push("/tasks");
      } else {
        setError("❌ Неверные учетные данные");
      }
    } catch (err) {
      console.error("Ошибка при входе:", err);
      setError("⚠️ Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-80 bg-white">
        <h2 className="text-lg font-bold mb-4">Вход</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          name="username"
          onChange={handleChange}
          placeholder="Логин"
          className="w-full p-2 border mb-2"
          required
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Пароль"
          className="w-full p-2 border mb-2"
          required
        />
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white">
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
