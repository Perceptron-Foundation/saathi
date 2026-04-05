import { NextRequest, NextResponse } from "next/server"
import { parseCookies } from "nookies"
import { jwtVerify, createRemoteJWKSet } from "jose"
import { supabaseUrl } from "@/lib/supabase"

const JWKS = createRemoteJWKSet(
  new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
)

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWKS)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const cookies = parseCookies({ req: request as any })
  const token = cookies["saathi-auth"]

  if (!token || !(await verifyToken(token))) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!$|sign-in|sign-up|auth/|_next/static|_next/image|favicon.ico).*)",],
};
