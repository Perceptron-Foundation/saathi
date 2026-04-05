import { supabase } from "@/lib/supabase"
import { setCookie } from "nookies"
import { NextRequest, NextResponse } from "next/server"

const AUTH_COOKIE_NAME = "saathi-auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      const response = NextResponse.redirect(`${origin}/dashboard`)

      const nowInSeconds = Math.floor(Date.now() / 1000)
      const maxAge = data.session.expires_at
        ? Math.max(data.session.expires_at - nowInSeconds, 0)
        : 60 * 60 * 24 * 7

      setCookie({ res: response }, AUTH_COOKIE_NAME, data.session.access_token, {
        maxAge,
        path: "/",
        sameSite: "lax",
      })

      return response
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`)
}