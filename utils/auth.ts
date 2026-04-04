import { supabase } from "@/lib/supabase"
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
        return { status: "INVALID_CREDENTIALS" };
        }

        if (error.message.toLowerCase().includes("email not confirmed")) {
        return { status: "EMAIL_NOT_VERIFIED" };
        }

        return { status: "UNKNOWN_ERROR", message: error.message };
    }

    return { status: "SUCCESS", data };
}

export async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { data, error }
}