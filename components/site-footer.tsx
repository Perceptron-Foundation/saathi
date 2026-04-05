"use client";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-badge" style={{ fontSize: "0.78rem" }}>
            SAATHI
          </span>
          <p className="footer-tagline">Empowering people with diabetes through AI-powered care.</p>
        </div>
        <div className="footer-links">
          {[
            { head: "Product", links: ["Features", "Pricing", "Download App"] },
            { head: "Resources", links: ["Blog", "Docs", "FAQ"] },
            { head: "Company", links: ["About", "Privacy Policy", "Contact"] },
          ].map((col) => (
            <div key={col.head} className="footer-col">
              <div className="footer-col-head">{col.head}</div>
              {col.links.map((link) => (
                <a key={link} href="#">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">© 2026 Saathi. All rights reserved.</div>
    </footer>
  );
}
