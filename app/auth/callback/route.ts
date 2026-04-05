import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  const response = NextResponse.redirect(new URL("/dashboard", origin))
  const supabase = createSupabaseServerClient(request, response)

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  return response
}