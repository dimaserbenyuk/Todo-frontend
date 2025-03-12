"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  const { login, checkAuth } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(form.username, form.password);
      if (success) {
        await checkAuth();
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
    <section className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome back</h2>
        <div className="flex gap-4 mt-6">
          <button className="flex items-center justify-center w-1/2 p-2 border rounded-lg text-gray-700 dark:text-white dark:border-gray-600">
            <FcGoogle className="mr-2 text-xl" /> Log in with Google
          </button>
          <button className="flex items-center justify-center w-1/2 p-2 border rounded-lg text-gray-700 dark:text-white dark:border-gray-600">
            <FaApple className="mr-2 text-xl" /> Log in with Apple
          </button>
        </div>
        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {loading ? "Signing in..." : "Sign in to your account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Don’t have an account yet? <a href="#" className="text-blue-600 hover:underline">Sign up here</a>
        </p>
      </div>
    </section>
  );
}
