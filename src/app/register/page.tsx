"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const { login, setUser } = useAuthStore(); // ✅ Используем setUser
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // ✅ Поддержка куков
      });

      if (!response.ok) {
        throw new Error("Ошибка при регистрации");
      }

      toast.success("Регистрация успешна!", {
        description: `Добро пожаловать, ${form.username}!`,
      });

      // ✅ Автоматический вход после регистрации
      const success = await login(form.username, form.password);
      if (success) {
        useAuthStore.getState().setUser(form.username); // 🔥 Явное обновление состояния
        router.push("/tasks");
      } else {
        throw new Error("Ошибка при входе после регистрации");
      }
    } catch (err) {
      toast.error("Ошибка", {
        description: "Пользователь уже существует или сервер недоступен.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Регистрация</h2>
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
        <button type="submit" disabled={loading} className="w-full p-2 bg-green-500 text-white">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}
