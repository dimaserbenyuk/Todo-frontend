"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(form.username, form.password);
    if (success) {
      router.push("/tasks");
    } else {
      setError("Неверные учетные данные");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Вход</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input name="username" onChange={handleChange} placeholder="Логин" className="w-full p-2 border mb-2" />
        <input name="password" type="password" onChange={handleChange} placeholder="Пароль" className="w-full p-2 border mb-2" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">Войти</button>
      </form>
    </div>
  );
}
