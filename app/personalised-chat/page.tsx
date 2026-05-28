"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

type GlucoseLogRow = {
  id: string;
  meal_name: string | null;
  recorded_at: string;
  glucose_level: number | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  rawJson?: string;
  createdAt: number;
};

const ASK_API = "https://saathi-ai-k354.onrender.com/ask";
const LOGS_API = "/api/glucose-log";

function toCompactDate(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractAssistantText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "I received a response, but it was empty.";
  const p = payload as Record<string, unknown>;
  const candidate =
    p.answer ??
    p.response ??
    p.reply ??
    p.message ??
    p.output ??
    p.result;
  if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  return "I processed your request. Check the JSON details below.";
}

export default function PersonalizedChatPage() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Share your question and I will answer using your recent meals context.",
      createdAt: Date.now(),
    },
  ]);
  const [recentLogs, setRecentLogs] = useState<GlucoseLogRow[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      const [{ data: userRes }, logsRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch(LOGS_API, { credentials: "include" }),
      ]);

      const authUserId = userRes?.user?.id ?? "";
      setUserId(authUserId);

      if (!logsRes.ok) return;
      const logsJson = await logsRes.json();
      const rows: GlucoseLogRow[] = Array.isArray(logsJson?.data) ? logsJson.data : [];
      setRecentLogs(rows);
    };

    void loadContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastFiveMeals = useMemo(() => {
    return recentLogs
      .filter((row) => row.meal_name)
      .slice(0, 5)
      .map((row) => ({
        meal_name: row.meal_name,
        recorded_at: row.recorded_at,
        glucose_level: row.glucose_level,
      }));
  }, [recentLogs]);

  const latestGlucose = useMemo(() => {
    return recentLogs.find((row) => typeof row.glucose_level === "number")?.glucose_level ?? 0;
  }, [recentLogs]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: query,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const body = {
        query,
        user_id: userId || "anonymous-user",
        glucose: latestGlucose ?? 0,
        iob: 0,
        last_5_meals: lastFiveMeals,
      };

      const response = await fetch(ASK_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`AI service failed with status ${response.status}`);
      }

      const aiJson = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        text: extractAssistantText(aiJson),
        rawJson: JSON.stringify(aiJson, null, 2),
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Could not get a response from the AI service. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not reach the AI service right now. Please try again in a moment.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteNavbar scrolled />

      <main className="chat-main">
        <section className="chat-wrap">
          <div className="chat-head">
            <div>
              <h1>Personalised AI Chat</h1>
              <p>Answers are enriched with your last 5 meals.</p>
            </div>
            <div className="meal-chip">Meals linked: {lastFiveMeals.length}/5</div>
          </div>

          <div className="messages">
            {messages.map((message) => (
              <div
                key={`${message.createdAt}-${message.role}`}
                className={`bubble ${message.role === "user" ? "bubble--user" : "bubble--ai"}`}
              >
                <p>{message.text}</p>
                {message.rawJson && (
                  <details>
                    <summary>View JSON response</summary>
                    <pre>{message.rawJson}</pre>
                  </details>
                )}
                <span className="time">{new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {lastFiveMeals.length > 0 && (
            <div className="context-strip">
              {lastFiveMeals.map((meal, idx) => (
                <div key={`${meal.recorded_at}-${idx}`} className="context-pill">
                  <span>{meal.meal_name}</span>
                  <small>{toCompactDate(meal.recorded_at)}</small>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="composer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about meal timing, glucose trends, or activity..."
              aria-label="Chat prompt"
            />
            <button type="submit" disabled={isSending || !input.trim()}>
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
          {error && <p className="err">{error}</p>}
        </section>
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

        .chat-main {
          min-height: calc(100vh - 68px);
          padding: 94px 1rem 2rem;
        }

        .chat-wrap {
          max-width: 960px;
          margin: 0 auto;
          border: 1px solid var(--border);
          background: linear-gradient(145deg, rgba(94, 217, 217, 0.08), rgba(255, 255, 255, 0.03));
          border-radius: 20px;
          backdrop-filter: blur(18px);
          box-shadow: 0 8px 36px rgba(0, 0, 0, 0.38);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .chat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .chat-head h1 {
          font-size: 1.2rem;
          margin: 0;
        }

        .chat-head p {
          margin: 0.25rem 0 0;
          font-size: 0.84rem;
          color: var(--text2);
        }

        .meal-chip {
          font-size: 0.75rem;
          color: var(--teal);
          border: 1px solid var(--teal-border);
          background: var(--teal-subtle);
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          white-space: nowrap;
        }

        .messages {
          min-height: 420px;
          max-height: 56vh;
          overflow-y: auto;
          padding: 0.35rem 0.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .bubble {
          max-width: 84%;
          padding: 0.72rem 0.85rem;
          border-radius: 12px;
          line-height: 1.5;
          font-size: 0.86rem;
        }

        .bubble p {
          margin: 0;
          white-space: pre-wrap;
        }

        .bubble--user {
          align-self: flex-end;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text);
          border: 1px solid var(--border);
          border-bottom-right-radius: 4px;
        }

        .bubble--ai {
          align-self: flex-start;
          background: var(--teal-subtle);
          border: 1px solid var(--teal-border);
          border-bottom-left-radius: 4px;
        }

        .bubble details {
          margin-top: 0.5rem;
          font-size: 0.78rem;
          color: var(--text2);
        }

        .bubble pre {
          margin-top: 0.45rem;
          background: rgba(0, 0, 0, 0.24);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.6rem;
          overflow-x: auto;
          font-size: 0.74rem;
          color: #d7f8f8;
        }

        .time {
          display: block;
          margin-top: 0.35rem;
          font-size: 0.68rem;
          color: var(--text3);
        }

        .context-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          border-top: 1px solid var(--border);
          padding-top: 0.8rem;
        }

        .context-pill {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.45rem 0.6rem;
          min-width: 130px;
        }

        .context-pill span {
          display: block;
          font-size: 0.79rem;
          font-weight: 700;
          color: var(--text);
        }

        .context-pill small {
          display: block;
          margin-top: 2px;
          font-size: 0.68rem;
          color: var(--text2);
        }

        .composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
          padding-top: 0.2rem;
        }

        .composer input {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          color: var(--text);
          padding: 0.75rem 0.85rem;
          font-size: 0.88rem;
          outline: none;
        }

        .composer input:focus {
          border-color: var(--teal-border);
          box-shadow: 0 0 0 3px rgba(46, 196, 196, 0.16);
        }

        .composer button {
          border: 0;
          border-radius: 12px;
          background: var(--teal);
          color: var(--bg);
          font-weight: 700;
          min-width: 100px;
          padding: 0 1rem;
          cursor: pointer;
        }

        .composer button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .err {
          font-size: 0.78rem;
          color: #fca5a5;
          margin: 0.2rem 0 0;
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
          .chat-main {
            padding-top: 82px;
          }

          .chat-wrap {
            padding: 0.8rem;
          }

          .chat-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .messages {
            min-height: 360px;
          }

          .bubble {
            max-width: 94%;
          }

          .composer {
            grid-template-columns: 1fr;
          }

          .composer button {
            min-height: 42px;
          }

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
