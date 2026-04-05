import { supabase } from "@/lib/supabase"
import { setCookie, destroyCookie } from "nookies";

const AUTH_COOKIE_NAME = "saathi-auth";

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

    const accessToken = data.session?.access_token;
    if (accessToken) {
        const maxAge = data.session.expires_at ? data.session.expires_at : 60 * 60;
        setCookie(null, AUTH_COOKIE_NAME, accessToken, { 
            maxAge,
            path: "/",
            sameSite: "strict",
            secure: true
        });
    }

    return { status: "SUCCESS", data }
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  const isExistingUser =
    error?.code === "user_already_exists" ||
    error?.code === "email_exists" ||
    error?.code === "conflict" ||
    /already registered|already exists/i.test(error?.message ?? "") ||
    (!!data.user && (data.user.identities?.length ?? 0) === 0)

  if (isExistingUser) return { status: "EXISTING_USER"  }
  if (error) return { status: "ERROR", message: error.message }

  return { status: "SUCCESS"}
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    destroyCookie(null, AUTH_COOKIE_NAME, { path: "/" });

    if (error) {
        return { status: "UNKNOWN_ERROR", message: error.message };
    }

    return { status: "SUCCESS" };
}
