import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Define public paths that shouldn't be protected
  const isAuthPage = pathname === "/login" || pathname === "/register";
  
  // 1. If user is logged in and trying to access login/register, redirect to Home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is NOT logged in and trying to access any page EXCEPT login/register, redirect to Login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
