// ADHD-friendly commitment system.
//
// Design principles (from research on ADHD adherence):
//  - Rewards are ADDITIVE and never lost. XP only goes up over time, so a
//    missed day never erases progress — this avoids the shame spiral that
//    fragile streak counters cause.
//  - Everything is DERIVED from completion data (single source of truth), so
//    nothing can desync and the user can always understand exactly how a
//    number was produced (transparency > manipulation).
//  - Visual, instant, low-math: levels, a filling XP bar, a calendar chain.

import { ExerciseCompletion } from "./types";

export const XP_PER_EXERCISE = 10;
export const XP_DAILY_BONUS = 25; // bonus for any day you show up

export type LevelInfo = {
  level: number;
  title: string;
  totalXp: number;
  xpIntoLevel: number;
  xpForThisLevel: number;
  xpToNextLevel: number;
  progressPct: number; // 0-100 within the current level
};

const LEVEL_TITLES: { min: number; title: string }[] = [
  { min: 1, title: "Getting Started" },
  { min: 3, title: "Warming Up" },
  { min: 5, title: "Consistent" },
  { min: 8, title: "Committed" },
  { min: 12, title: "Strong" },
  { min: 18, title: "Resilient" },
  { min: 25, title: "Unstoppable" },
  { min: 40, title: "Legend" },
];

export function levelTitle(level: number): string {
  let title = LEVEL_TITLES[0].title;
  for (const t of LEVEL_TITLES) {
    if (level >= t.min) title = t.title;
  }
  return title;
}

// XP required to ADVANCE from `level` to `level + 1`. Gentle early curve so
// the first few levels come fast (early dopamine), then widens.
function xpToAdvanceFrom(level: number): number {
  return 80 + (level - 1) * 40;
}

export function levelInfoForXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  let need = xpToAdvanceFrom(level);

  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = xpToAdvanceFrom(level);
  }

  return {
    level,
    title: levelTitle(level),
    totalXp: Math.max(0, Math.floor(totalXp)),
    xpIntoLevel: remaining,
    xpForThisLevel: need,
    xpToNextLevel: need - remaining,
    progressPct: Math.round((remaining / need) * 100),
  };
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type CommitmentStats = {
  totalXp: number;
  level: LevelInfo;
  totalCompletions: number; // total completed exercise instances
  activeDays: number; // unique days with at least one completion
  currentStreak: number; // forgiving: today-not-yet-done doesn't break it
  longestStreak: number;
  rollingConsistency: number; // % of last 30 days with activity (0-100)
  completedDates: Set<string>;
};

// Build the full commitment picture from completed completions.
export function computeCommitmentStats(completions: ExerciseCompletion[]): CommitmentStats {
  const completed = completions.filter((c) => c.completed);
  const completedDates = new Set(completed.map((c) => c.date));

  const totalCompletions = completed.length;
  const activeDays = completedDates.size;

  // XP = per-exercise + a daily show-up bonus. Both additive, never decrease.
  const totalXp = totalCompletions * XP_PER_EXERCISE + activeDays * XP_DAILY_BONUS;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Current streak — forgiving: if today isn't done yet, start from yesterday.
  let currentStreak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = toLocalDateString(d);
    if (completedDates.has(ds)) {
      currentStreak++;
    } else if (i === 0) {
      continue; // today not done yet — don't break
    } else {
      break;
    }
  }

  // Longest streak across all history.
  const sorted = Array.from(completedDates)
    .map((s) => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d).getTime();
    })
    .sort((a, b) => a - b);
  let longestStreak = sorted.length > 0 ? 1 : 0;
  let run = sorted.length > 0 ? 1 : 0;
  const DAY = 24 * 60 * 60 * 1000;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((sorted[i] - sorted[i - 1]) / DAY);
    if (diff === 1) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else if (diff > 1) {
      run = 1;
    }
  }

  // Rolling consistency: how many of the last 30 days had any activity.
  let activeInWindow = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (completedDates.has(toLocalDateString(d))) activeInWindow++;
  }
  const rollingConsistency = Math.round((activeInWindow / 30) * 100);

  return {
    totalXp,
    level: levelInfoForXp(totalXp),
    totalCompletions,
    activeDays,
    currentStreak,
    longestStreak,
    rollingConsistency,
    completedDates,
  };
}

// ---- Achievements (derived, transparent, never revoked once shown) ----

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
};

export function computeAchievements(stats: CommitmentStats): Achievement[] {
  const list: (Omit<Achievement, "earned"> & { test: (s: CommitmentStats) => boolean })[] = [
    { id: "first-win", emoji: "🌱", title: "First Win", description: "Completed your first exercise", test: (s) => s.totalCompletions >= 1 },
    { id: "first-day", emoji: "✅", title: "Showed Up", description: "Finished a full day", test: (s) => s.activeDays >= 1 },
    { id: "streak-3", emoji: "🔥", title: "3-Day Streak", description: "Three days in a row", test: (s) => s.currentStreak >= 3 || s.longestStreak >= 3 },
    { id: "streak-7", emoji: "⚡", title: "One Week", description: "Seven days in a row", test: (s) => s.longestStreak >= 7 },
    { id: "streak-30", emoji: "👑", title: "30-Day Champion", description: "A full month streak", test: (s) => s.longestStreak >= 30 },
    { id: "days-10", emoji: "🎯", title: "10 Active Days", description: "Showed up 10 days total", test: (s) => s.activeDays >= 10 },
    { id: "days-50", emoji: "🚀", title: "50 Active Days", description: "Showed up 50 days total", test: (s) => s.activeDays >= 50 },
    { id: "reps-100", emoji: "💯", title: "100 Exercises", description: "Logged 100 exercises", test: (s) => s.totalCompletions >= 100 },
    { id: "level-5", emoji: "🏅", title: "Level 5", description: "Reached level 5", test: (s) => s.level.level >= 5 },
    { id: "level-10", emoji: "🏆", title: "Level 10", description: "Reached level 10", test: (s) => s.level.level >= 10 },
    { id: "consistent", emoji: "📈", title: "Consistent", description: "Active 20+ of the last 30 days", test: (s) => s.rollingConsistency >= 67 },
  ];

  return list.map((a) => ({
    id: a.id,
    emoji: a.emoji,
    title: a.title,
    description: a.description,
    earned: a.test(stats),
  }));
}

// Track which achievements have already been celebrated so we only pop once.
const SEEN_KEY = "seenAchievements";

export function getNewlyEarned(achievements: Achievement[]): Achievement[] {
  if (typeof window === "undefined") return [];
  let seen: string[] = [];
  try {
    seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    seen = [];
  }
  const earned = achievements.filter((a) => a.earned);
  const fresh = earned.filter((a) => !seen.includes(a.id));
  // First load (nothing seen yet) shouldn't dump every past achievement at once.
  if (seen.length === 0) {
    localStorage.setItem(SEEN_KEY, JSON.stringify(earned.map((a) => a.id)));
    return [];
  }
  if (fresh.length > 0) {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, ...fresh.map((a) => a.id)]));
  }
  return fresh;
}

// Build a month grid (weeks of 7) for a consistency calendar.
export type CalendarCell = {
  date: string | null; // null = padding cell
  inMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  completed: boolean;
};

export function buildMonthGrid(year: number, month: number, completedDates: Set<string>): CalendarCell[] {
  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toLocalDateString(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startDow; i++) {
    cells.push({ date: null, inMonth: false, isToday: false, isFuture: false, completed: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const ds = toLocalDateString(d);
    cells.push({
      date: ds,
      inMonth: true,
      isToday: ds === todayStr,
      isFuture: d.getTime() > today.getTime(),
      completed: completedDates.has(ds),
    });
  }
  return cells;
}
