// lib/api.ts
import { useAuth } from '@clerk/nextjs'

const API_BASE_URL = 'http://localhost:8080/api/v1'

export function useFetchWithAuth() {
  const { getToken } = useAuth() // Используем `useAuth()` на клиенте


  return async (endpoint: string, options: RequestInit = {}) => {
    if (!getToken) {
      throw new Error('Ошибка аутентификации: Clerk не инициализирован')
    }

    const token = await getToken()
    if (!token) {
      throw new Error('Ошибка: не удалось получить JWT токен')
    }
    console.log("Отправляем запрос с токеном:", token)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.statusText}`)
    }

    return response.json()
  }
}
