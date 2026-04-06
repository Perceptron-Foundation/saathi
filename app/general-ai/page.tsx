"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function GeneralAIPage() {
  return (
    <div className="page-shell">
      <SiteNavbar scrolled />

      <main className="embed-main">
        <iframe
          title="Saathi General AI Chat"
          src="https://saathi-ai-tn773dcmimwvrh6qvnuus3.streamlit.app/General_Chat?embed=true"
          className="embed-frame"
          allow="clipboard-read; clipboard-write"
        />
      </main>

      <SiteFooter />

      <style jsx global>{`
        :root {
          --teal: #2ec4c4;
          --teal-subtle: rgba(46, 196, 196, 0.09);
          --teal-border: rgba(46, 196, 196, 0.32);
          --bg: #141c26;
          --bg2: #111820;
          --border: rgba(255, 255, 255, 0.09);
          --text: #ffffff;
          --text2: rgba(255, 255, 255, 0.55);
          --text3: rgba(255, 255, 255, 0.32);
        }

        .page-shell {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
          color: var(--text);
        }

        .embed-main {
          min-height: calc(100vh - 68px);
          padding-top: 68px;
        }

        .embed-frame {
          display: block;
          width: 100%;
          height: calc(100vh - 68px);
          border: 0;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 2rem;
          transition: background 0.3s, box-shadow 0.3s;
        }

        .navbar--scrolled {
          background: rgba(17, 24, 32, 0.88);
          backdrop-filter: blur(18px);
          box-shadow: 0 1px 0 var(--border);
        }

        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }

        .logo-badge {
          display: inline-block;
          border: 1.5px solid var(--teal);
          color: var(--teal);
          border-radius: 50px;
          padding: 0.38rem 1rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-decoration: none;
          background: transparent;
          transition: background 0.2s;
        }

        .logo-badge:hover {
          background: var(--teal-subtle);
        }

        .nav-links {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--text2);
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: var(--text2);
          font-size: 0.9rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-btn:hover {
          color: var(--text);
        }

        .nav-btn:disabled {
          color: var(--text3);
          cursor: not-allowed;
        }

        .nav-cta {
          background: var(--teal) !important;
          color: var(--bg) !important;
          padding: 0.5rem 1.3rem !important;
          border-radius: 50px;
          font-weight: 700 !important;
          font-size: 0.88rem !important;
        }

        .nav-cta:hover {
          opacity: 0.85 !important;
        }

        .footer {
          background: #0d1520;
          border-top: 1px solid var(--border);
          padding: 60px 2rem 0;
          color: var(--text2);
        }

        .footer-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          gap: 4rem;
          flex-wrap: wrap;
          padding-bottom: 3rem;
          border-bottom: 1px solid var(--border);
        }

        .footer-brand {
          flex: 1.5;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-tagline {
          font-size: 0.83rem;
          line-height: 1.6;
        }

        .footer-links {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.52rem;
          min-width: 110px;
        }

        .footer-col-head {
          font-weight: 700;
          color: var(--text);
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }

        .footer-col a {
          text-decoration: none;
          font-size: 0.82rem;
          color: var(--text2);
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: var(--teal);
        }

        .footer-bottom {
          max-width: 1160px;
          margin: 0 auto;
          padding: 1.2rem 0;
          font-size: 0.74rem;
          color: var(--text3);
        }

        @media (max-width: 680px) {
          .nav-links {
            gap: 1rem;
          }

          .footer-inner {
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
