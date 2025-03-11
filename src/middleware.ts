import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export function middleware(req: NextRequest) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token; // Проверяем токен

  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url)); // 🚨 Возможная причина редиректа
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks", "/dashboard"], // 👀 Где срабатывает middleware
};
