"use client";

import Link from "next/link";

type SiteNavbarProps = {
  scrolled: boolean;
  isAuthenticated?: boolean;
  isLoggingOut?: boolean;
  onLogout?: () => void;
  logoHref?: string;
};

export function SiteNavbar({
  scrolled,
  isAuthenticated = false,
  isLoggingOut = false,
  onLogout,
  logoHref = "/",
}: SiteNavbarProps) {
  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href={logoHref} className="logo-badge">
          SAATHI
        </Link>

        <ul className="nav-links">
          <li>
            <Link href="#features">Features</Link>
          </li>
          <li>
            <Link href="#blogs">Blogs</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-btn"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up" className="nav-cta">
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
