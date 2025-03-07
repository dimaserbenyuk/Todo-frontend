'use client'
import { useEffect, useState } from 'react'
import { useFetchWithAuth } from '@/lib/api'

export default function TasksPage() {
  const fetchWithAuth = useFetchWithAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithAuth('/tasks')
      .then(setTasks)
      .catch(err => {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Произошла неизвестная ошибка')
        }
      })
  }, [])

  const addTask = async () => {
    try {
      const createdTask = await fetchWithAuth('/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask),
      })
      setTasks([...tasks, createdTask])
      setNewTask({ title: '', description: '' }) // Очистка формы
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Произошла неизвестная ошибка')
      }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await fetchWithAuth(`/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Произошла неизвестная ошибка')
      }
    }
  }

  if (error) return <p className="text-red-500">Ошибка: {error}</p>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Список задач</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Название задачи"
          className="border p-2 rounded w-full mb-2"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          className="border p-2 rounded w-full mb-2"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={addTask}
        >
          Добавить задачу
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{task.title}</strong>: {task.description}
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => deleteTask(task.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
