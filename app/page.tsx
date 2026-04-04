"use client";

import { useState, useEffect } from "react";

const blogs = [
  {
    title: "Beyond Type 1",
    author: "Official Website",
    date: "Global Diabetes Community",
    readTime: "Educational Resource",
    tag: "Community",
    excerpt:
      "Beyond Type 1 shares practical guides, real patient stories, and support resources for people living with Type 1 and Type 2 diabetes.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
    href: "https://beyondtype1.org/",
  },
  {
    title: "International Diabetes Federation (IDF)",
    author: "Official Website",
    date: "Worldwide Federation",
    readTime: "Policy and Research",
    tag: "Global Health",
    excerpt:
      "IDF is a worldwide federation focused on diabetes prevention, care standards, and advocacy through global reports, campaigns, and education.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    href: "https://idf.org/",
  },
  {
    title: "TAP Health",
    author: "Official Website",
    date: "Digital Care Platform",
    readTime: "Health Technology",
    tag: "Health Tech",
    excerpt:
      "TAP Health provides digital health support and AI-driven tools that help users access healthcare guidance and make better daily decisions.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    href: "https://tap.health/",
  },
];

const meals = [
  { name: "Dal", kcal: "120 kcal", emoji: "🫙" },
  { name: "Khichdi", kcal: "180 kcal", emoji: "🍚" },
  { name: "Palak Paneer", kcal: "180 kcal · 1 cup", emoji: "🧀" },
  { name: "Roti", kcal: "80 kcal · 1 piece", emoji: "🫓" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mealIndex, setMealIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMealIndex((i) => (i + 1) % meals.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="root">

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="logo-badge">SAATHI</a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="/sign-in">Sign In</a></li>
            <li><a href="/sign-up" className="nav-cta">Get Started</a></li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="hero-content">
          <div className="hero-badge">🩺 AI-Powered Diabetes Care</div>
          <h1 className="hero-title">
            Live bold.<br />
            <span className="accent">Manage smarter.</span>
          </h1>
          <p className="hero-sub">
            Personalised meal plans, 24/7 AI assistant, glucose tracking —<br />designed for people living with diabetes.
          </p>
          <div className="hero-actions">
            <a href="/sign-up" className="btn btn--primary">Sign Up</a>
            <a href="/sign-in" className="btn btn--ghost">Sign In →</a>
          </div>
        </div>

        <div className="hero-cards">
          {/* Meal Plan Card */}
          <div className="glass-card">
            <div className="card-header">
              <span className="card-icon">🥗</span>
              <div style={{ flex: 1 }}>
                <div className="card-title">Personalised Meal Plans</div>
                <div className="card-sub">Diabetes-friendly Indian meals, perfectly portioned.</div>
              </div>
              <span className="card-badge">Sample</span>
            </div>
            <div className="meal-list">
              {meals.map((m, i) => (
                <div key={m.name} className={`meal-item ${i === mealIndex ? "meal-item--on" : ""}`}>
                  <span className="meal-emoji">{m.emoji}</span>
                  <div className="meal-info">
                    <div className="meal-name">{m.name}</div>
                    <div className="meal-kcal">{m.kcal}</div>
                  </div>
                  <div className="meal-bar-wrap">
                    <div className="meal-bar" style={{ width: `${[55,70,75,35][i]}%` }} />
                  </div>
                  <span className="meal-arrow">›</span>
                </div>
              ))}
            </div>
            <div className="card-footer-row">
              <span className="card-footer-txt">✓ Low GI &nbsp;·&nbsp; ✓ Balanced carbs &nbsp;·&nbsp; ✓ Chef-approved</span>
            </div>
          </div>

          {/* Assistant Card */}
          <div className="glass-card">
            <div className="card-header">
              <span className="card-icon card-icon--teal">✦</span>
              <div style={{ flex: 1 }}>
                <div className="card-title">24/7 AI Diabetes Assistant</div>
                <div className="card-sub">Ask anything. Get evidence-based answers instantly.</div>
              </div>
            </div>
            <div className="chat-preview">
              <div className="chat-bubble chat-bubble--user">Can I eat rice if I have Type 2 diabetes?</div>
              <div className="chat-bubble chat-bubble--ai">
                <span className="ai-dot">✦</span>
                Yes — in moderation. Opt for basmati or brown rice, keep portions to ½ cup, and pair with dal to slow glucose absorption.
              </div>
              <div className="chat-bubble chat-bubble--user">When should I check my blood sugar?</div>
              <div className="chat-bubble chat-bubble--ai">
                <span className="ai-dot">✦</span>
                Check fasting in the morning, then 2 hours after each meal for the clearest picture of how food affects your levels.
              </div>
            </div>
            <div className="card-footer-row" style={{ marginTop: "0.75rem" }}>
              <span className="card-footer-txt">✓ Available 24/7 &nbsp;·&nbsp; ✓ Clinically informed &nbsp;·&nbsp; ✓ No waiting</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section" id="features">
        <div className="section-inner">
          <span className="pill">Core Features</span>
          <h2 className="sec-title">Built for every type of diabetes</h2>
          <p className="sec-sub">Three intelligent modules working together to support your health journey.</p>
          <div className="feat-grid">
            {[
              {
                icon: "💬", tag: "General Chat · T1D",
                title: "General Chat App for T1D",
                desc: "Powered by Gemma 4 medical models, ask any diabetes-related question and get clinically-informed answers — available around the clock.",
                items: ["✓ Gemma 4 medical AI models", "✓ Data source augmentation", "✓ Type 1 Diabetes specialised"],
              },
              {
                icon: "📊", tag: "Glucose Logging",
                title: "Smart Glucose Logging",
                desc: "Track your readings, build streaks, and receive personalised recommendations based on your diet and exercise data.",
                items: ["✓ Streak building & motivation", "✓ Diet + exercise recommendations", "✓ Feeds into personalised chat"],
              },
              {
                icon: "🤖", tag: "Personalised AI",
                title: "Personalised Chat App",
                desc: "A RAG-powered AI that knows your health history — generates PDF reports, sends smart reminders, and answers with your data in context.",
                items: ["✓ Log data → RAG chat responses", "✓ PDF health reports", "✓ Smart reminders & notifications"],
              },
            ].map((f) => (
              <div key={f.title} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-tag">{f.tag}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
                <ul className="feat-list">
                  {f.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <a href="#" className="feat-link">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOGS ── */}
      <section className="section blogs-section" id="blogs">
        <div className="section-inner">
          <span className="pill">Trusted Resources</span>
          <h2 className="sec-title">Helpful diabetes websites</h2>
          <div className="blogs-grid">
            {blogs.map((b) => (
              <a href={b.href} key={b.title} className="blog-card" target="_blank" rel="noopener noreferrer">
                <div className="blog-img-wrap">
                  <img src={b.image} alt={b.title} className="blog-img" />
                  <span className="blog-tag">{b.tag}</span>
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="blog-author">{b.author}</span>
                    <span className="dot">·</span>
                    <span>{b.date}</span>
                    <span className="dot">·</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="blog-title">{b.title}</h3>
                  <p className="blog-excerpt">{b.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <a href="https://idf.org/" className="btn btn--primary" target="_blank" rel="noopener noreferrer">Visit More Resources →</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-badge" style={{ fontSize: "0.78rem" }}>SAATHI</span>
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
                {col.links.map((l) => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">© 2026 Saathi. All rights reserved.</div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --teal: #2ec4c4;
          --teal-dark: #1a9e9e;
          --teal-glow: rgba(46,196,196,0.18);
          --teal-subtle: rgba(46,196,196,0.09);
          --teal-border: rgba(46,196,196,0.32);
          --bg: #141c26;
          --bg2: #111820;
          --glass: rgba(255,255,255,0.055);
          --glass-hover: rgba(255,255,255,0.085);
          --border: rgba(255,255,255,0.09);
          --text: #ffffff;
          --text2: rgba(255,255,255,0.55);
          --text3: rgba(255,255,255,0.32);
          --radius: 20px;
          --shadow: 0 8px 36px rgba(0,0,0,0.38);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Helvetica Neue', 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

        /* NAVBAR */
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 2rem; transition: background 0.3s, box-shadow 0.3s; }
        .navbar--scrolled { background: rgba(17,24,32,0.88); backdrop-filter: blur(18px); box-shadow: 0 1px 0 var(--border); }
        .nav-inner { max-width: 1160px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 68px; }
        .logo-badge { display: inline-block; border: 1.5px solid var(--teal); color: var(--teal); border-radius: 50px; padding: 0.38rem 1rem; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.13em; text-decoration: none; background: transparent; transition: background 0.2s; }
        .logo-badge:hover { background: var(--teal-subtle); }
        .nav-links { list-style: none; display: flex; align-items: center; gap: 2rem; }
        .nav-links a { text-decoration: none; color: var(--text2); font-size: 0.9rem; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-cta { background: var(--teal) !important; color: var(--bg) !important; padding: 0.5rem 1.3rem !important; border-radius: 50px; font-weight: 700 !important; font-size: 0.88rem !important; }
        .nav-cta:hover { opacity: 0.85 !important; }

        /* HERO */
        .hero { min-height: 100vh; background: linear-gradient(160deg, #1f3345 0%, #1a2a38 35%, #141c26 68%, #0f1820 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 110px 2rem 70px; position: relative; overflow: hidden; }
        .blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
        .blob-1 { width: 550px; height: 550px; background: rgba(46,196,196,0.09); top: -120px; right: -100px; }
        .blob-2 { width: 400px; height: 400px; background: rgba(14,100,120,0.13); bottom: -80px; left: -80px; }
        .blob-3 { width: 280px; height: 280px; background: rgba(46,196,196,0.05); top: 42%; left: 50%; transform: translateX(-50%); }
        .hero-content { position: relative; z-index: 1; }
        .hero-badge { display: inline-block; background: var(--teal-subtle); border: 1px solid var(--teal-border); color: var(--teal); border-radius: 50px; padding: 0.34rem 1rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 1.5rem; }
        .hero-title { font-size: clamp(2.3rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; margin-bottom: 1.1rem; }
        .accent { color: var(--teal); }
        .hero-sub { max-width: 500px; margin: 0 auto 2.2rem; font-size: 1.02rem; color: var(--text2); line-height: 1.7; }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; position: relative; z-index: 1; }

        .btn { display: inline-flex; align-items: center; text-decoration: none; border-radius: 50px; padding: 0.78rem 1.9rem; font-size: 0.91rem; font-weight: 600; transition: all 0.22s; cursor: pointer; border: none; }
        .btn--primary { background: var(--teal); color: var(--bg); box-shadow: 0 4px 20px rgba(46,196,196,0.28); }
        .btn--primary:hover { opacity: 0.87; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,196,196,0.36); }
        .btn--ghost { background: var(--glass); color: var(--text); border: 1.5px solid var(--border); backdrop-filter: blur(8px); }
        .btn--ghost:hover { border-color: var(--teal); color: var(--teal); }

        /* HERO CARDS */
        .hero-cards { display: flex; gap: 1.4rem; justify-content: center; flex-wrap: wrap; width: 100%; max-width: 900px; position: relative; z-index: 1; }
        .glass-card { background: var(--glass); border: 1px solid var(--border); backdrop-filter: blur(18px); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.4rem; flex: 1; min-width: 300px; max-width: 400px; text-align: left; }
        .card-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
        .card-icon { width: 38px; height: 38px; background: var(--teal-subtle); border: 1px solid var(--teal-border); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .card-icon--teal { color: var(--teal); font-size: 1rem; }
        .card-title { font-weight: 700; font-size: 0.91rem; color: var(--text); }
        .card-sub { font-size: 0.75rem; color: var(--text2); margin-top: 2px; }
        .meal-list { display: flex; flex-direction: column; gap: 0.42rem; }
        .meal-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.48rem 0.68rem; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid transparent; transition: all 0.4s; }
        .meal-item--on { background: var(--teal-subtle); border-color: var(--teal-border); transform: translateX(4px); }
        .meal-emoji { font-size: 1.05rem; width: 28px; height: 28px; background: rgba(255,255,255,0.07); border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .meal-name { font-size: 0.81rem; font-weight: 600; color: var(--text); }
        .meal-kcal { font-size: 0.68rem; color: var(--text2); }
        .meal-arrow { margin-left: auto; color: var(--text3); }
        .notif { display: flex; align-items: flex-start; gap: 0.68rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 13px; padding: 0.88rem; position: relative; }
        .notif-icon { width: 40px; height: 40px; background: var(--teal); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-weight: 800; font-size: 0.7rem; flex-shrink: 0; }
        .notif-hl { font-size: 0.79rem; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .notif-txt { font-size: 0.71rem; color: var(--text2); line-height: 1.5; }
        .notif-heart { position: absolute; top: -6px; right: 10px; color: #ef4444; font-size: 1.05rem; }

        /* card extras */
        .card-badge { font-size: 0.68rem; font-weight: 700; background: var(--teal-subtle); border: 1px solid var(--teal-border); color: var(--teal); border-radius: 50px; padding: 0.2rem 0.6rem; white-space: nowrap; align-self: flex-start; flex-shrink: 0; }
        .card-live { font-size: 0.68rem; font-weight: 700; color: #4ade80; white-space: nowrap; align-self: flex-start; letter-spacing: 0.03em; flex-shrink: 0; }
        .meal-info { flex: 1; min-width: 0; }
        .meal-bar-wrap { width: 52px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 99px; flex-shrink: 0; overflow: hidden; }
        .meal-bar { height: 100%; background: var(--teal); border-radius: 99px; transition: width 0.6s ease; }
        .meal-item--on .meal-bar { box-shadow: 0 0 8px rgba(46,196,196,0.5); }
        .card-footer-row { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; margin-top: 0.4rem; border-top: 1px solid var(--border); }
        .card-footer-txt { font-size: 0.68rem; color: var(--text3); }
        .card-footer-pct { font-size: 0.68rem; color: var(--teal); font-weight: 600; }
        .assist-stats { display: flex; align-items: center; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 0.75rem; }
        .assist-stat { flex: 1; text-align: center; }
        .assist-stat__val { font-size: 1.2rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
        .assist-stat__val span { font-size: 0.6rem; font-weight: 600; color: var(--text2); margin-left: 2px; }
        .assist-stat__lbl { font-size: 0.63rem; color: var(--text3); margin-top: 4px; }
        .assist-divider { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; }
        .chat-preview { display: flex; flex-direction: column; gap: 0.48rem; margin-top: 0.75rem; }
        .chat-bubble { font-size: 0.75rem; line-height: 1.5; padding: 0.58rem 0.82rem; border-radius: 12px; max-width: 92%; }
        .chat-bubble--user { background: rgba(255,255,255,0.06); color: var(--text2); border: 1px solid var(--border); align-self: flex-end; border-bottom-right-radius: 4px; }
        .chat-bubble--ai { background: var(--teal-subtle); border: 1px solid var(--teal-border); color: var(--text); align-self: flex-start; border-bottom-left-radius: 4px; display: flex; gap: 0.38rem; align-items: flex-start; }
        .ai-dot { color: var(--teal); font-size: 0.68rem; margin-top: 2px; flex-shrink: 0; }

        /* SECTION SHARED */
        .section { padding: 100px 2rem; }
        .section-inner { max-width: 1160px; margin: 0 auto; }
        .features-section { background: var(--bg); }
        .blogs-section { background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%); }
        .pill { display: inline-block; background: var(--teal-subtle); border: 1px solid var(--teal-border); color: var(--teal); border-radius: 50px; padding: 0.27rem 0.82rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1rem; }
        .sec-title { font-size: clamp(1.75rem, 3vw, 2.4rem); font-weight: 800; color: var(--text); margin-bottom: 0.6rem; letter-spacing: -0.02em; }
        .sec-sub { font-size: 0.95rem; color: var(--text2); margin-bottom: 2.6rem; max-width: 460px; }

        /* FEATURES */
        .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.2rem; }
        .feat-card { background: var(--glass); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.75rem; backdrop-filter: blur(8px); transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s, background 0.25s; }
        .feat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); border-color: var(--teal-border); background: var(--glass-hover); }
        .feat-icon { font-size: 1.75rem; margin-bottom: 0.65rem; }
        .feat-tag { font-size: 0.69rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--teal); margin-bottom: 0.6rem; display: block; }
        .feat-title { font-size: 1.08rem; font-weight: 800; color: var(--text); margin-bottom: 0.52rem; }
        .feat-desc { font-size: 0.86rem; color: var(--text2); line-height: 1.7; margin-bottom: 1.05rem; }
        .feat-list { list-style: none; display: flex; flex-direction: column; gap: 0.36rem; margin-bottom: 1.35rem; }
        .feat-list li { font-size: 0.81rem; color: rgba(255,255,255,0.6); }
        .feat-link { font-size: 0.82rem; font-weight: 700; color: var(--teal); text-decoration: none; }
        .feat-link:hover { text-decoration: underline; }

        /* BLOGS */
        .blogs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.2rem; margin-bottom: 2.5rem; }
        .blog-card { background: var(--glass); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; text-decoration: none; color: inherit; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; display: flex; flex-direction: column; backdrop-filter: blur(8px); }
        .blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--teal-border); }
        .blog-img-wrap { position: relative; height: 188px; overflow: hidden; }
        .blog-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .blog-card:hover .blog-img { transform: scale(1.04); }
        .blog-tag { position: absolute; bottom: 0; left: 0; right: 0; background: var(--teal); color: var(--bg); text-align: center; padding: 0.36rem; font-size: 0.74rem; font-weight: 700; }
        .blog-body { padding: 1.1rem; flex: 1; display: flex; flex-direction: column; gap: 0.45rem; }
        .blog-meta { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: var(--text2); flex-wrap: wrap; }
        .blog-author { font-weight: 600; color: var(--text); }
        .dot { color: var(--text3); }
        .blog-title { font-size: 0.95rem; font-weight: 800; color: var(--text); line-height: 1.4; }
        .blog-excerpt { font-size: 0.81rem; color: var(--text2); line-height: 1.6; flex: 1; }

        /* FOOTER */
        .footer { background: #0d1520; border-top: 1px solid var(--border); padding: 60px 2rem 0; color: var(--text2); }
        .footer-inner { max-width: 1160px; margin: 0 auto; display: flex; gap: 4rem; flex-wrap: wrap; padding-bottom: 3rem; border-bottom: 1px solid var(--border); }
        .footer-brand { flex: 1.5; min-width: 200px; display: flex; flex-direction: column; gap: 0.8rem; }
        .footer-tagline { font-size: 0.83rem; line-height: 1.6; }
        .footer-links { display: flex; gap: 3rem; flex-wrap: wrap; }
        .footer-col { display: flex; flex-direction: column; gap: 0.52rem; min-width: 110px; }
        .footer-col-head { font-weight: 700; color: var(--text); font-size: 0.85rem; margin-bottom: 0.3rem; }
        .footer-col a { text-decoration: none; font-size: 0.82rem; color: var(--text2); transition: color 0.2s; }
        .footer-col a:hover { color: var(--teal); }
        .footer-bottom { max-width: 1160px; margin: 0 auto; padding: 1.2rem 0; font-size: 0.74rem; color: var(--text3); }

        @media (max-width: 680px) {
          .hero-cards { flex-direction: column; align-items: center; }
          .nav-links { gap: 1rem; }
          .footer-inner { gap: 2rem; }
        }
      `}</style>
    </div>
  );
}
