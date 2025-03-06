// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Функция для обновления токена
  const refreshAccessToken = async () => {
    try {
        console.log("🔄 Обновление токена...");
        const refreshToken = localStorage.getItem("refresh_token");
        console.log("📡 Refresh Token:", refreshToken);

        if (!refreshToken) throw new Error("❌ Нет refresh-токена");

        const res = await fetch("http://localhost:8080/api/v1/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        console.log("📡 Ответ от сервера при обновлении:", res.status);

        if (!res.ok) throw new Error("❌ Ошибка обновления токена");

        const data = await res.json();
        console.log("✅ Новый Access Token:", data.access_token);

        setAccessToken(data.access_token);
        localStorage.setItem("access_token", data.access_token);
    } catch (err) {
        console.error("⚠️ Ошибка обновления токена:", err);
        setAccessToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
};

  // Функция для загрузки задач
  const fetchTodos = async () => {
    const token = accessToken || localStorage.getItem("access_token");
    console.log("📡 Отправляем запрос с токеном:", token); // DEBUG

    if (!token) {
        console.error("❌ Нет access_token, прерываем запрос");
        return;
    }

    setLoading(true);
    try {
        const res = await fetch("http://localhost:8080/api/v1/tasks", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📡 Ответ от сервера:", res.status);
        
        if (res.status === 401) {
            console.warn("🔄 Токен истёк, обновляем...");
            await refreshAccessToken();
            return fetchTodos(); // Повторяем запрос
        }

        if (!res.ok) {
            throw new Error(`Ошибка HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Полученные задачи:", data);
        if (Array.isArray(data)) {
            setTodos(data);
        } else {
            throw new Error("Неверный формат данных");
        }
    } catch (err: any) {
        console.error("❌ Ошибка при загрузке:", err.message);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
        setAccessToken(token);
        fetchTodos(); // Load todos when token is found
    }
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <main>
      <h1>TODO List</h1>
      {accessToken && <button onClick={handleLogout}>Выйти</button>}

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {!loading && !error && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <strong>{todo.title}</strong> ({todo.status}, приоритет {todo.priority})
              <br />
              {todo.description}
              <br />
              <em>Назначено: {todo.assignee}</em>
              <br />
              <em>Теги: {todo.tags.join(", ")}</em>
              <br />
              <em>Создано: {new Date(todo.created_at).toLocaleString()}</em>
              <br />
              <em>Дедлайн: {new Date(todo.due_date).toLocaleString()}</em>
              <br />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
