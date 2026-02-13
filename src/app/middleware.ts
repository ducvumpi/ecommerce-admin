import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = [
  "/products",
  "/variants",
  "/orders",
  "/categories",
  "/users",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Bỏ qua route public
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ Chỉ chặn route admin
  const isAdminRoute = ADMIN_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // 🔐 Check login (Supabase cookie)
  const hasAuthCookie = req.cookies
    .getAll()
    .some((c) => c.name.includes("auth-token"));

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Có login → cho qua
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/variants/:path*",
    "/orders/:path*",
    "/categories/:path*",
    "/users/:path*",
  ],
};
