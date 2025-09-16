// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.includes(pathname);

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/auth/:path*"],
};