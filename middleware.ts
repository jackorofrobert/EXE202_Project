import { NextResponse, type NextRequest } from "next/server"
import { DatabaseService } from "@/lib/db-service"

export async function middleware(request: NextRequest) {
  // Get current user from Firebase Auth
  const currentUser = await DatabaseService.getCurrentUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (currentUser.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Protect psychologist routes
  if (request.nextUrl.pathname.startsWith("/psychologist")) {
    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (currentUser.role !== "psychologist") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
