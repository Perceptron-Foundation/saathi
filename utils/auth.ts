import { supabase } from "@/lib/supabase"

const AUTH_COOKIE_NAME = "saathi-auth";

function setAuthCookie(expiresAt?: number) {
    if (typeof document === "undefined") {
        return;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const maxAge = expiresAt ? Math.max(expiresAt - nowInSeconds, 0) : 60 * 60 * 24 * 7;
    document.cookie = `${AUTH_COOKIE_NAME}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookie() {
    if (typeof document === "undefined") {
        return;
    }

    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

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

    setAuthCookie(data.session?.expires_at);
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

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    clearAuthCookie();

    if (error) {
        return { status: "UNKNOWN_ERROR", message: error.message };
    }

    return { status: "SUCCESS" };
}
