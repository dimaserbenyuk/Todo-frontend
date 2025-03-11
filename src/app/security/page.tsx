"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
  const [hasApiToken, setHasApiToken] = useState<boolean>(false);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkApiToken();
  }, []);

  // Проверяем, есть ли уже API-токен в базе
  const checkApiToken = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/token", {
        credentials: "include",
      });
      if (res.ok) {
        // Если ответ 200 OK, значит токен найден (но мы не считываем само значение)
        setHasApiToken(true);
      } else {
        // Например, 404 = "No API token found"
        setHasApiToken(false);
      }
    } catch (err) {
      toast.error("Ошибка при проверке API-токена");
    } finally {
      setLoading(false);
    }
  };

  // Генерация нового API-токена
  const handleGenerateToken = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/token/generate_api", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка генерации токена");

      // Бэкенд возвращает { "api_token": "eyJhbGc..." }, но мы не показываем тут
      await res.json();

      toast.success("API-токен успешно сгенерирован!");
      setHasApiToken(true);
      setRevealedToken(null); // сбрасываем на всякий случай
    } catch (err) {
      toast.error("Не удалось сгенерировать токен");
    } finally {
      setLoading(false);
    }
  };

  // Отозвать токен
  const handleRevokeToken = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/revoke", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка отзыва токена");

      toast.success("Токен отозван!");
      setHasApiToken(false);
      setRevealedToken(null);
    } catch (err) {
      toast.error("Не удалось отозвать токен");
    } finally {
      setLoading(false);
    }
  };

  // Запрашиваем реальное значение токена (если хотим показать)
  const handleRevealToken = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/token", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        // Допустим, бэкенд возвращает { "token": "eyJhbG..." }
        setRevealedToken(data.token);
      } else {
        toast.error("Токен не найден");
      }
    } catch (err) {
      toast.error("Не удалось получить токен");
    } finally {
      setLoading(false);
    }
  };

  // Скрыть видимый токен
  const handleHideToken = () => {
    setRevealedToken(null);
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
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-6 border-b">
              <h3 className="text-lg font-bold">API Token</h3>
              <p className="text-sm text-gray-500 mt-1">
                Управляйте своим личным API-токеном для доступа к нашей API.
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {hasApiToken ? (
                <>
                  {revealedToken ? (
                    <div className="border rounded bg-gray-50 p-4">
                      <p className="text-sm text-gray-500 font-semibold mb-2">
                        Ваш текущий API-токен:
                      </p>
                      <p className="font-mono text-sm break-all text-gray-800">
                        {revealedToken}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 font-semibold">
                        Используйте этот токен, добавляя заголовок:
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
                        {`Authorization: Bearer ${revealedToken}`}
                      </pre>

                      <Button
                        // variant="secondary"
                        onClick={handleHideToken}
                        className="mt-3"
                      >
                        Скрыть токен
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      У вас есть активный API-токен (скрыт для безопасности).
                    </p>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    {!revealedToken && (
                      <Button onClick={handleRevealToken} disabled={loading}>
                        Показать токен
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={handleRevokeToken}
                      disabled={loading}
                    >
                      Отозвать токен
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <p className="text-sm text-gray-600">
                    У вас нет активного API-токена. Нажмите кнопку, чтобы
                    сгенерировать.
                  </p>
                  <Button onClick={handleGenerateToken} disabled={loading}>
                    Сгенерировать токен
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
