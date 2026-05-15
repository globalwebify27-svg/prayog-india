import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. If trying to access protected routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    
    // No token? Redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      const { payload } = await jwtVerify(token, SECRET);
      
      // 2. Admin/Teacher Route Protection
      if (pathname.startsWith("/admin")) {
        if (payload.role !== "admin" && payload.role !== "teacher") {
          // If student tries to access admin, send to dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // 3. Student Dashboard Protection
      if (pathname.startsWith("/dashboard")) {
        if (payload.role !== "student") {
          // If admin/teacher tries to access student dashboard, send to admin
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }

      // Authorized!
      return NextResponse.next();

    } catch (error) {
      // Invalid token? Redirect to login
      console.error("Proxy Auth Error:", error.message);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Redirect logged-in users away from login/register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role === "admin" || payload.role === "teacher") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (e) {
      // If token invalid, let them see login page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register"
  ],
};
