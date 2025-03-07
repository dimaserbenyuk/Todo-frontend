import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/api/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth() // Дожидаемся получения объекта аутентификации

  if (isProtectedRoute(req) && !authObject.userId) {
    return new Response('Unauthorized', { status: 401 }) // Если пользователь не аутентифицирован, возвращаем 401
  }
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
