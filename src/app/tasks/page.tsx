"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function TasksPage() {
  const { logout } = useAuthStore();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tasks")
      .then((res) => setTasks(res.data.length ? res.data : [])) // ✅ Гарантируем, что tasks будет массивом
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Мои задачи</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : tasks && tasks.length > 0 ? ( // ✅ Проверяем, есть ли задачи
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="border p-3 mb-2">
              <h2 className="text-lg">{task.title}</h2>
              <p>{task.description}</p>
              <p>Статус: {task.completed ? "✅ Выполнено" : "❌ В процессе"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">У вас пока нет задач</p> // ✅ Сообщение, если задач нет
      )}
    </div>
  );
}
