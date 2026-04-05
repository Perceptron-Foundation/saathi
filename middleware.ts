import { NextRequest, NextResponse } from "next/server"
import { parseCookies } from "nookies"
import { jwtVerify, createRemoteJWKSet } from "jose"
import { supabaseUrl } from "@/lib/supabase"

const JWKS = createRemoteJWKSet(
  new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
)

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"]

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWKS)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = parseCookies({ req: request as any })
  const token = cookies["saathi-auth"]
  const isAuthenticated = token ? await verifyToken(token) : false

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")

  if (isPublic) return NextResponse.next()

  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}