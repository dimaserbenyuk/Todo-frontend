"use client";

import "../styles/globals.css"; // ✅ Подключаем Tailwind
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
