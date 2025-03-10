import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export function middleware(req: NextRequest) {
  const cookies = parse(req.headers.get("cookie") || "");
  const accessToken = cookies.access_token;

  // Разрешаем все API-запросы
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Если нет токена, редирект на логин
  if (!accessToken && req.nextUrl.pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*"],
};
