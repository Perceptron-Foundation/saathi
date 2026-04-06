"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {SiteNavbar}   from "@/components/site-navbar";
import {SiteFooter} from "@/components/site-footer";
import { signOut } from "@/utils/auth";
import { supabase } from "@/lib/supabase";

type ReadingType = "FASTING" | "POST_MEAL" | "RANDOM";

type Reading = {
  id: number | string;
  glucose_level: number;
  glucose_reading_type: ReadingType;
  meal_name: string;
  exercise_done: string;
  exercise_duration: number | "";
  notes: string;
  timestamp: Date;
};

type ReadingRow = {
  id: number | string;
  glucose_level: number;
  glucose_reading_type: ReadingType;
  meal_name: string | null;
  exercise_done: string | null;
  exercise_duration: number | null;
  notes: string | null;
  created_at: string;
};

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
};

const GET_RECENT_LOGS_API = "/api/glucose-log";
const SAVE_LOG_API = "/api/glucose-log";

const TYPE_META: Record<ReadingType, { label: string; icon: string }> = {
  FASTING: { label: "Fasting", icon: "🌅" },
  POST_MEAL: { label: "Post-Meal", icon: "🍽️" },
  RANDOM: { label: "Random", icon: "❓" },
};

const EXERCISE_OPTIONS = ["Walking", "Running", "Cycling", "Swimming", "Yoga", "Gym", "Other"];

function mapDbReading(row: ReadingRow): Reading {
  return {
    id: row.id,
    glucose_level: row.glucose_level,
    glucose_reading_type: row.glucose_reading_type,
    meal_name: row.meal_name ?? "",
    exercise_done: row.exercise_done ?? "",
    exercise_duration: row.exercise_duration ?? "",
    notes: row.notes ?? "",
    timestamp: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

function extractRows(payload: unknown): ReadingRow[] {
  if (Array.isArray(payload)) return payload as ReadingRow[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: ReadingRow[] }).data;
  }
  return [];
}

function getStatus(value: number, type: ReadingType): { label: string; color: string } {
  if (type === "FASTING") {
    if (value < 70) return { label: "Low", color: "#f87171" };
    if (value <= 99) return { label: "Normal", color: "#4ade80" };
    if (value <= 125) return { label: "Elevated", color: "#fbbf24" };
    return { label: "High", color: "#f87171" };
  }
  if (value < 70) return { label: "Low", color: "#f87171" };
  if (value <= (type === "POST_MEAL" ? 139 : 139)) return { label: "Normal", color: "#4ade80" };
  if (value <= (type === "POST_MEAL" ? 179 : 199)) return { label: "Elevated", color: "#fbbf24" };
  return { label: "High", color: "#f87171" };
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: Date) {
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function GlucoseLog() {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);

  const [glucoseLevel, setGlucoseLevel] = useState("");
  const [readingType, setReadingType] = useState<ReadingType>("FASTING");
  const [mealName, setMealName] = useState("");
  const [exerciseDone, setExerciseDone] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dbError, setDbError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function getUserFromServerCookie(): Promise<AuthUser | null> {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) return null;

      const payload = await response.json();
      if (!payload || typeof payload !== "object" || !("user" in payload)) return null;

      const user = (payload as { user?: AuthUser | null }).user;
      return user ?? null;
    }

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      let user = userData.user as AuthUser | null;

      // Browser auth state can be empty while a valid server cookie still exists.
      if (!user) {
        user = await getUserFromServerCookie();
      }

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      if (!mounted) return;
      setUserId(user.id);

      const response = await fetch(GET_RECENT_LOGS_API, {
        method: "GET",
        cache: "no-store",
      });

      if (!mounted) return;
      if (!response.ok) {
        setDbError("Could not load your readings.");
      } else {
        const payload = await response.json();
        const rows = extractRows(payload);
        setReadings(rows.map(mapDbReading));
      }
      setIsLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  function validate() {
    const e: Record<string, string> = {};
    const num = parseInt(glucoseLevel, 10);
    if (!glucoseLevel || Number.isNaN(num)) e.glucoseLevel = "Enter a valid glucose value.";
    else if (num < 20 || num > 600) e.glucoseLevel = "Value must be between 20 - 600 mg/dL.";
    if (exerciseDone && exerciseDuration === "") e.exerciseDuration = "Enter duration for exercise.";
    if (exerciseDuration !== "" && !exerciseDone) e.exerciseDone = "Select an exercise type.";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!userId) return;

    setErrors({});
    setDbError("");
    setIsSaving(true);

    const response = await fetch(SAVE_LOG_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        glucose_level: parseInt(glucoseLevel, 10),
        glucose_reading_type: readingType,
        meal_name: mealName || null,
        exercise_done: exerciseDone || null,
        exercise_duration: exerciseDuration !== "" ? parseInt(exerciseDuration, 10) : null,
        notes: notes || null,
      }),
    })

    if (!response.ok) {
      setDbError("Could not save your reading.");
      setIsSaving(false);
      return;
    }

    const payload = await response.json();
    const savedRow =
      payload && typeof payload === "object" && "data" in payload
        ? (payload as { data?: ReadingRow }).data
        : (payload as ReadingRow);

    if (!savedRow) {
      setDbError("Could not save your reading.");
      setIsSaving(false);
      return;
    }

    setReadings((prev) => [mapDbReading(savedRow), ...prev]);
    setGlucoseLevel("");
    setReadingType("FASTING");
    setMealName("");
    setExerciseDone("");
    setExerciseDuration("");
    setNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setIsSaving(false);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    const result = await signOut();
    setIsLoggingOut(false);
    if (result.status === "SUCCESS") router.push("/");
  }

  const recentThree = readings.slice(0, 3);
  const avg = readings.length ? Math.round(readings.reduce((acc, r) => acc + r.glucose_level, 0) / readings.length) : 0;
  const avgStatus = readings.length ? getStatus(avg, "FASTING") : null;

  const liveNum = parseInt(glucoseLevel, 10);
  const liveStatus = !Number.isNaN(liveNum) && liveNum >= 20 && liveNum <= 600 ? getStatus(liveNum, readingType) : null;

  return (
    <div className="root">
      <SiteNavbar
        scrolled={scrolled}
        isAuthenticated={!!userId}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        logoHref="/dashboard"
      />

      <main className="main">
        <div className="page-inner">
          <div className="page-header">
            <div>
              <div className="page-eyebrow">Glucose Tracker</div>
              <h1 className="page-title">Log Your Reading</h1>
              <p className="page-sub">Readings shown here are for your logged-in account.</p>
            </div>
            {recentThree[0] && (
              <div className="latest-chip">
                <div className="chip-label">Latest</div>
                <div className="chip-val">{recentThree[0].glucose_level} mg/dL</div>
                <div className="chip-meta">{TYPE_META[recentThree[0].glucose_reading_type].label} · {formatTime(recentThree[0].timestamp)}</div>
              </div>
            )}
          </div>

          <div className="layout">
            <div className="glass-card card">
              <h3>New Entry</h3>

              <label>Glucose Level</label>
              <div className="input-wrap">
                <input
                  className={`input ${errors.glucoseLevel ? "input--err" : ""}`}
                  type="number"
                  value={glucoseLevel}
                  onChange={(e) => {
                    setGlucoseLevel(e.target.value);
                    setErrors((p) => ({ ...p, glucoseLevel: "" }));
                  }}
                  placeholder="e.g. 120"
                  min={20}
                  max={600}
                />
                {liveStatus && <span className="badge" style={{ color: liveStatus.color }}>{liveStatus.label}</span>}
              </div>
              {errors.glucoseLevel && <p className="err">{errors.glucoseLevel}</p>}

              <label>Reading Type</label>
              <div className="type-row">
                {(Object.keys(TYPE_META) as ReadingType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-btn ${readingType === t ? "type-btn--on" : ""}`}
                    onClick={() => setReadingType(t)}
                  >
                    {TYPE_META[t].icon} {TYPE_META[t].label}
                  </button>
                ))}
              </div>

              <label>Meal / Food Eaten</label>
              <input className="input" value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="Optional" />

              <label htmlFor="exercise-done">Exercise Done</label>
              <div className="exercise-row">
                <select
                  id="exercise-done"
                  title="Exercise done"
                  className={`input ${errors.exerciseDone ? "input--err" : ""}`}
                  value={exerciseDone}
                  onChange={(e) => {
                    setExerciseDone(e.target.value);
                    setErrors((p) => ({ ...p, exerciseDone: "" }));
                  }}
                >
                  <option value="">No exercise</option>
                  {EXERCISE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <input
                  className={`input ${errors.exerciseDuration ? "input--err" : ""}`}
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => {
                    setExerciseDuration(e.target.value);
                    setErrors((p) => ({ ...p, exerciseDuration: "" }));
                  }}
                  placeholder="Minutes"
                  disabled={!exerciseDone}
                />
              </div>
              {(errors.exerciseDone || errors.exerciseDuration) && <p className="err">{errors.exerciseDone || errors.exerciseDuration}</p>}

              <label>Notes</label>
              <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />

              <button className="save-btn" onClick={handleSubmit} disabled={isLoading || isSaving || !userId}>
                {submitted ? "Saved!" : isSaving ? "Saving..." : "Save Reading"}
              </button>
              {dbError && <p className="err">{dbError}</p>}
            </div>

            <div className="right-col">
              <div className="glass-card stat-row">
                <div><div className="stat-val">{avg}</div><div className="stat-label">Avg mg/dL</div></div>
                <div><div className="stat-val">{readings.length}</div><div className="stat-label">Readings</div></div>
                <div><div className="stat-val" style={{ color: avgStatus?.color ?? "#9ca3af" }}>{avgStatus?.label ?? "--"}</div><div className="stat-label">Avg Status</div></div>
              </div>

              <div className="list">
                {isLoading && <div className="glass-card empty">Loading your readings...</div>}
                {!isLoading && recentThree.length === 0 && <div className="glass-card empty">No readings yet for this account.</div>}
                {recentThree.map((r) => (
                  <div key={r.id} className="glass-card item">
                    <div className="item-top">
                      <strong>{TYPE_META[r.glucose_reading_type].icon} {TYPE_META[r.glucose_reading_type].label}</strong>
                      <span>{r.glucose_level} mg/dL</span>
                    </div>
                    <div className="muted">{formatDate(r.timestamp)} · {formatTime(r.timestamp)}</div>
                    <div className="pill-wrap">
                      {r.meal_name && <span className="pill">Meal: {r.meal_name}</span>}
                      {r.exercise_done && <span className="pill">Exercise: {r.exercise_done}{r.exercise_duration !== "" ? ` · ${r.exercise_duration} min` : ""}</span>}
                      {r.notes && <span className="pill">Notes: {r.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      <style jsx global>{`
        :root {
          --teal: #2ec4c4;
          --teal-subtle: rgba(46, 196, 196, 0.09);
          --border: rgba(255, 255, 255, 0.12);
          --glass: rgba(255, 255, 255, 0.05);
          --bg: #141c26;
          --text: #f8fafc;
          --muted: rgba(255, 255, 255, 0.65);
          --danger: #f87171;
        }
        body { background: var(--bg); color: var(--text); }
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; padding: 0 1.25rem; }
        .navbar--scrolled { background: rgba(17, 24, 32, 0.88); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
        .nav-inner { max-width: 1120px; margin: 0 auto; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .logo-badge { display: inline-block; border: 1.5px solid var(--teal); color: var(--teal); border-radius: 999px; padding: 0.35rem 0.95rem; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.13em; text-decoration: none; }
        .nav-links { list-style: none; display: flex; align-items: center; gap: 1rem; }
        .nav-links a, .nav-username, .nav-btn { color: var(--muted); font-size: 0.9rem; }
        .nav-btn { background: transparent; border: none; cursor: pointer; }
        .nav-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .main { padding-top: 78px; background: linear-gradient(160deg, #1a2a38 0%, #141c26 50%, #0f1820 100%); min-height: 100vh; }
        .page-inner { max-width: 1120px; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
        .page-header { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .page-eyebrow { color: var(--teal); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .page-title { font-size: 2rem; margin-top: 0.2rem; }
        .page-sub { color: var(--muted); font-size: 0.92rem; margin-top: 0.25rem; }
        .latest-chip { border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem 1rem; background: var(--glass); min-width: 220px; }
        .chip-label { color: var(--muted); font-size: 0.72rem; }
        .chip-val { font-size: 1.25rem; font-weight: 700; margin: 0.15rem 0; }
        .chip-meta { color: var(--muted); font-size: 0.78rem; }

        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .glass-card { border: 1px solid var(--border); border-radius: 14px; background: var(--glass); }
        .card { padding: 1rem; }
        .card h3 { margin-bottom: 0.8rem; }
        .card label { font-size: 0.8rem; color: var(--muted); margin: 0.55rem 0 0.35rem; display: block; }
        .input { width: 100%; border: 1px solid var(--border); background: rgba(255, 255, 255, 0.06); color: var(--text); border-radius: 10px; padding: 0.65rem 0.75rem; }
        .input--err { border-color: var(--danger); }
        .input-wrap { position: relative; }
        .badge { position: absolute; right: 0.7rem; top: 0.65rem; font-size: 0.75rem; font-weight: 700; }
        .type-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .type-btn { border: 1px solid var(--border); background: rgba(255, 255, 255, 0.06); color: var(--text); border-radius: 999px; padding: 0.45rem 0.7rem; cursor: pointer; }
        .type-btn--on { border-color: var(--teal); background: var(--teal-subtle); }
        .exercise-row { display: grid; grid-template-columns: 1fr 120px; gap: 0.5rem; }
        .exercise-row select option { color: var(--text); background: #1b2531; }
        .save-btn { margin-top: 0.8rem; width: 100%; background: var(--teal); color: #0b1e26; font-weight: 700; border: none; border-radius: 10px; padding: 0.7rem; cursor: pointer; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .err { color: var(--danger); font-size: 0.8rem; margin-top: 0.35rem; }

        .right-col { display: flex; flex-direction: column; gap: 0.8rem; }
        .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 0.8rem; text-align: center; }
        .stat-val { font-size: 1.2rem; font-weight: 800; }
        .stat-label { color: var(--muted); font-size: 0.72rem; }
        .list { display: flex; flex-direction: column; gap: 0.6rem; }
        .item { padding: 0.8rem; }
        .item-top { display: flex; justify-content: space-between; gap: 0.6rem; }
        .muted { color: var(--muted); font-size: 0.78rem; margin-top: 0.25rem; }
        .pill-wrap { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.45rem; }
        .pill { border: 1px solid var(--border); border-radius: 999px; padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--muted); }
        .empty { padding: 0.8rem; color: var(--muted); }

        .footer { background: #0d1520; border-top: 1px solid var(--border); padding: 60px 2rem 0; color: var(--muted); }
        .footer-inner { max-width: 1120px; margin: 0 auto; display: flex; gap: 2rem; flex-wrap: wrap; padding-bottom: 2rem; border-bottom: 1px solid var(--border); }
        .footer-brand { flex: 1.5; min-width: 200px; display: flex; flex-direction: column; gap: 0.8rem; }
        .footer-tagline { font-size: 0.83rem; line-height: 1.6; }
        .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
        .footer-col { display: flex; flex-direction: column; gap: 0.5rem; min-width: 110px; }
        .footer-col-head { font-weight: 700; color: var(--text); font-size: 0.85rem; }
        .footer-col a { text-decoration: none; font-size: 0.82rem; color: var(--muted); }
        .footer-bottom { max-width: 1120px; margin: 0 auto; padding: 1rem 0; font-size: 0.74rem; color: rgba(255, 255, 255, 0.45); }

        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .nav-links { gap: 0.65rem; }
        }
      `}</style>
    </div>
  );
}
