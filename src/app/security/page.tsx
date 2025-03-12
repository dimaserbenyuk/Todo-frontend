"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";

export default function SecurityPage() {
  const [hasApiToken, setHasApiToken] = useState(false);
  const [revealedToken, setRevealedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkApiToken();
  }, []);

  const checkApiToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/token", {
        credentials: "include",
      });
      setHasApiToken(res.ok);
    } catch (err) {
      toast.error("Ошибка при проверке API-токена");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/token/generate_api", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка генерации токена");
      toast.success("API-токен успешно сгенерирован!");
      setHasApiToken(true);
      setRevealedToken(null);
    } catch (err) {
      toast.error("Не удалось сгенерировать токен");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeToken = async () => {
    setLoading(true);
    try {
      const token = revealedToken; // Используем текущий API-токен
      if (!token) throw new Error("Нет токена для отзыва");
  
      const res = await fetch("http://localhost:8080/api/v1/revoke", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
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

  const handleRevealToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/token", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Токен не найден");
      const data = await res.json();
      setRevealedToken(data.token);
    } catch (err) {
      toast.error("Не удалось получить токен");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (revealedToken) {
      navigator.clipboard.writeText(revealedToken);
      toast.success("Токен скопирован!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-sm text-gray-500">Manage your account info.</p>
        <nav className="mt-4 space-y-2">
          <a href="/profile" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">👤 Profile</a>
          <a href="/security" className="flex items-center px-3 py-2 text-sm text-gray-900 bg-gray-200 rounded-lg">🔒 Security</a>
        </nav>
      </aside>
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-6 border-b">
              <h3 className="text-lg font-bold">API Token</h3>
              <p className="text-sm text-gray-500">Управляйте API-токеном.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {hasApiToken ? (
                <>
                  {revealedToken ? (
                    <div className="border rounded bg-gray-50 p-4 overflow-x-auto relative">
                      <p className="text-sm text-gray-500 font-semibold mb-2">Ваш текущий API-токен:</p>
                      <p className="font-mono text-sm break-all text-gray-800">{revealedToken}</p>
                      <button onClick={handleCopyToken} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                        <Copy size={18} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">У вас есть API-токен (скрыт).</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 font-semibold">Используйте этот токен:</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">Authorization: Bearer {revealedToken}</pre>
                  <Separator />
                  <div className="flex gap-2">
                    {!revealedToken && <Button onClick={handleRevealToken} disabled={loading}>Показать токен</Button>}
                    <Button variant="destructive" onClick={handleRevokeToken} disabled={loading}>Отозвать токен</Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <p className="text-sm text-gray-600">Нет активного API-токена. Сгенерируйте новый.</p>
                  <Button onClick={handleGenerateToken} disabled={loading}>Сгенерировать токен</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}