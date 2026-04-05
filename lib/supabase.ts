import { createBrowserClient } from '@supabase/ssr'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required.")
}

if (!supabaseKey) {
  throw new Error(
    "A Supabase public key is required. Set NEXT_PUBLIC_SUPABASE_ANON_KEY."
  )
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)
