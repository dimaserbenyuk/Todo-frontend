"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator"; // Если нужно

export default function ProfilePage() {
  // Структура профиля
  const [profile, setProfile] = useState<{
    username: string;
    email?: string;
    roles: string[];
    created_at: string;
    task_count: number;
    avatar_url?: string; // Если бэкенд возвращает ссылку на аватар
  } | null>(null);

  // Индикатор загрузки
  const [loading, setLoading] = useState(true);

  // Получаем данные профиля
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/profile", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки профиля");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast.error("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Загрузка...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Боковое меню слева */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-sm text-gray-500">Manage your account info.</p>
        <nav className="mt-4 space-y-2">
          <a
            href="/profile"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-lg"
          >
            <span className="mr-2">👤</span> Profile
          </a>
          <a
            href="/security"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mr-2">🔒</span> Security
          </a>
        </nav>
      </aside>

      {/* Контент профиля */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="flex items-center justify-between p-6 border-b">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold">{profile?.username}</h3>
                <p className="text-sm text-gray-500">{profile?.email || "No email"}</p>
              </div>
              {/* При желании можно вывести аватар, если бэкенд возвращает avatar_url */}
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover border"
                />
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Роли:</span>
                <span className="font-medium">{profile?.roles.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Дата регистрации:</span>
                <span className="font-medium">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "Неизвестно"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Создано задач:</span>
                <span className="font-medium">{profile?.task_count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
