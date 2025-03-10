"use client";

import { useAuthStore } from "@/lib/authStore";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <html lang="ru">
      <body className="bg-gray-100 text-gray-900">
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
          <Link href="/">Home</Link>
          {user ? (
            <button onClick={logout} className="bg-red-500 px-4 py-2">Выйти</button>
          ) : (
            <Link href="/login">Вход</Link>
          )}
        </nav>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
