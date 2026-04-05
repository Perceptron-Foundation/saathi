import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"]

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  )
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  const supabase = createSupabaseServerClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isPublicRoute(pathname)) {
    return response
  }

  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}