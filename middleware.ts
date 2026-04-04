import { NextRequest, NextResponse } from "next/server";

function hasSupabaseSessionCookie(request: NextRequest) {
  const cookies = request.cookies.getAll();

  return cookies.some(({ name, value }) => {
    if (!value) {
      return false;
    }

    return (
      name === "saathi-auth" ||
      name === "sb-access-token" ||
      name === "sb-refresh-token" ||
      (name.startsWith("sb-") && name.includes("auth-token"))
    );
  });
}

export function middleware(request: NextRequest) {
  const isLoggedIn = hasSupabaseSessionCookie(request);

  if (!isLoggedIn) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
