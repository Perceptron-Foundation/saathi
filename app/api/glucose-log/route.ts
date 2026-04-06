import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient(request)

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const {
    glucose_level,
    glucose_reading_type,
    meal_name,
    exercise_done,
    exercise_duration,
    notes,
  } = body

  if (!glucose_level || !glucose_reading_type) {
    return NextResponse.json(
      { error: "glucose_level and glucose_reading_type are required" },
      { status: 400 }
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!profile || profileError) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 })
  }

  const { data, error: insertError } = await supabase
    .from("glucose_log")
    .insert({
      user_profile_id: profile.id,
      glucose_level,
      glucose_reading_type,
      meal_name: meal_name ?? null,
      exercise_done: exercise_done ?? null,
      exercise_duration: exercise_duration ?? null,
      notes: notes ?? null,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}


export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient(request)

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!profile || profileError) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 })
  }

  const { data, error: logsError } = await supabase
    .from("glucose_log")
    .select("*")
    .eq("user_profile_id", profile.id)
    .order("recorded_at", { ascending: false })
    .limit(10)

  if (logsError) {
    return NextResponse.json({ error: logsError.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 200 })
}