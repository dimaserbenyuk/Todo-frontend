"use client";

import "../styles/globals.css"; // ✅ Подключаем Tailwind
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <ToastProvider /> {/* ✅ Добавляем поддержку уведомлений */}
        <Navbar />
        <main className="container mx-auto p-6 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
