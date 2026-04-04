import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const response = NextResponse.redirect(`${origin}/dashboard`)
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const maxAge = data.session?.expires_at
        ? Math.max(data.session.expires_at - nowInSeconds, 0)
        : 60 * 60 * 24 * 7

      response.cookies.set("saathi-auth", "1", {
        path: "/",
        sameSite: "lax",
        maxAge,
      })

      return response
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=verification_failed`)
}
