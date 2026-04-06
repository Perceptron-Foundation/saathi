import { supabaseKey, supabaseUrl } from "@/lib/supabase"

const HEALTH_CHECK_TIMEOUT_MS = 3000
const serviceRoleKey = process.env.SUPABASE_SECRET

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
      return Response.json(
        { success: false, message: "Supabase not configured" },
        { status: 503 }
      )
    }

    const authCheck = fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
    })

    const dbCheck = fetch(`${supabaseUrl}/rest/v1/user_profile?select=id&limit=1`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
    })

    const [authRes, dbRes] = await Promise.all([authCheck, dbCheck])

    if (!authRes.ok || !dbRes.ok) {
      console.error("Auth check:", authRes.status, "DB check:", dbRes.status)
      return Response.json(
        { success: false, message: "Supabase services unhealthy" },
        { status: 503 }
      )
    }

    return Response.json(
      { success: true, message: "All services healthy" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Health check error:", err)
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}