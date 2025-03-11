"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
  // Храним текущий API-токен
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // При загрузке проверим, есть ли токен
  useEffect(() => {
    fetchApiToken();
  }, []);

  const fetchApiToken = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/token", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setApiToken(data.token); // Если есть
      } else {
        setApiToken(null);
      }
    } catch (err) {
      toast.error("Ошибка получения токена");
    } finally {
      setLoading(false);
    }
  };

  // Генерировать токен
  const handleGenerateToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/token/generate", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка генерации токена");
      const data = await res.json();
      setApiToken(data.token);
      toast.success("Токен сгенерирован!");
    } catch (err) {
      toast.error("Не удалось сгенерировать токен");
    }
  };

  // Отозвать токен
  const handleRevokeToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/token/revoke", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка отзыва токена");
      toast.success("Токен отозван!");
      setApiToken(null);
    } catch (err) {
      toast.error("Не удалось отозвать токен");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Боковое меню слева */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-sm text-gray-500">Manage your account info.</p>
        <nav className="mt-4 space-y-2">
          <a
            href="/profile"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mr-2">👤</span> Profile
          </a>
          <a
            href="/security"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-lg"
          >
            <span className="mr-2">🔒</span> Security
          </a>
        </nav>
      </aside>

      {/* Контент Security */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto relative">
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-6 border-b">
              <h3 className="text-lg font-bold">API Token</h3>
              <p className="text-sm text-gray-500 mt-1">
                Управляйте своим личным API-токеном для доступа к нашей API.
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {apiToken ? (
                <>
                  <div className="p-4 border rounded bg-gray-50">
                    <p className="text-sm text-gray-500 mb-1">
                      Ваш текущий API-токен:
                    </p>
                    <p className="font-mono text-sm break-all text-gray-800">
                      {apiToken}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Используйте этот токен, добавляя заголовок:
                    <pre className="bg-gray-100 p-2 mt-1 rounded text-xs">
{`Authorization: Bearer ${apiToken}`}
                    </pre>
                  </p>
                  <Separator />
                  <Button variant="destructive" onClick={handleRevokeToken}>
                    Отозвать токен
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-start space-y-3">
                  <p>У вас нет активного API-токена. Нажмите кнопку, чтобы сгенерировать.</p>
                  <Button onClick={handleGenerateToken}>Сгенерировать токен</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
