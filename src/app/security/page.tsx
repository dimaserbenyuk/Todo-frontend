"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCcw, Trash } from "lucide-react";

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
      const res = await fetch("http://localhost:8080/api/v1/revoke", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${revealedToken}`,
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Active personal access tokens</h2>
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">API Token</h3>
          <Button onClick={handleGenerateToken} disabled={loading} className="ml-auto">Add new token</Button>
        </CardHeader>
        <CardContent className="p-6">
          {hasApiToken ? (
            <div className="border rounded bg-gray-50 p-4 overflow-x-auto relative">
              <p className="text-sm text-gray-500 font-semibold mb-2">Ваш текущий API-токен:</p>
              <p className="font-mono text-sm break-all text-gray-800">{revealedToken || "••••••••••••••••••"}</p>
              <div className="flex gap-2 mt-4">
                {!revealedToken && <Button onClick={handleRevealToken} disabled={loading}>Показать токен</Button>}
                <Button variant="outline" onClick={handleCopyToken} disabled={!revealedToken}><Copy size={18} /></Button>
                <Button variant="destructive" onClick={handleRevokeToken} disabled={loading}><Trash size={18} /></Button>
                <Button variant="outline" disabled={loading}><RefreshCcw size={18} /></Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Нет активного API-токена.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}