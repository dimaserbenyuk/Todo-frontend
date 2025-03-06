export async function fetchTasks(token: string) {
    const res = await fetch('http://localhost:8080/api/v1/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  }
  