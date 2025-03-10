"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Ошибка при регистрации");
      }

      const data = await response.json();
      alert(`Пользователь ${form.username} успешно зарегистрирован!`);

      router.push("/login"); // После регистрации перенаправляем на вход
    } catch (err) {
      setError("Ошибка при регистрации. Возможно, пользователь уже существует.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Регистрация
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Логин"
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:bg-gray-400"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
