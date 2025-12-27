import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 公开路径,不需要认证
const publicPaths = ["/login", "/register", "/"]

// 认证后不应访问的路径
const authPaths = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check auth-token cookie (synced from localStorage by client)
  const authToken = request.cookies.get("auth-token")
  const isAuthenticated = !!authToken?.value

  // 如果已认证,访问登录/注册页面,重定向到 dashboard
  if (isAuthenticated && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 如果未认证,访问受保护页面,重定向到登录页
  // Allow public paths and static assets
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
