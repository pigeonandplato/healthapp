// Habit storage (v1) — localStorage only, works fully offline.
// No database needed; habits are personal and lightweight.

import { HabitKind } from "./habitCoach";

const STORAGE_KEY = "getback.userHabits";

export interface UserHabit {
  id: string;
  label: string;
  kind: HabitKind;
  createdAt: string; // ISO timestamp
  lastWinDate?: string; // YYYY-MM-DD
  winDates?: string[]; // all days a win was logged (for streaks/counts)
}

export function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getHabits(): UserHabit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UserHabit[];
  } catch {
    return [];
  }
}

function persist(habits: UserHabit[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // ignore quota/availability errors
  }
}

// Fire-and-forget cloud mirror so habits sync across devices. Failures are
// silent — localStorage stays the offline-first source of truth.
function pushRemote(habits: UserHabit[]): void {
  if (typeof window === "undefined") return;
  import("./db")
    .then(({ saveRemoteHabits }) => saveRemoteHabits(habits))
    .catch(() => {});
}

function mergeHabits(local: UserHabit[], remote: UserHabit[]): UserHabit[] {
  const byId = new Map<string, UserHabit>();

  const absorb = (h: UserHabit) => {
    const existing = byId.get(h.id);
    if (!existing) {
      byId.set(h.id, { ...h, winDates: [...(h.winDates || [])] });
      return;
    }
    // Union win dates, keep the earliest createdAt and a non-empty label.
    const dates = new Set([...(existing.winDates || []), ...(h.winDates || [])]);
    const sorted = Array.from(dates).sort();
    byId.set(h.id, {
      ...existing,
      label: existing.label || h.label,
      kind: existing.kind || h.kind,
      createdAt: existing.createdAt < h.createdAt ? existing.createdAt : h.createdAt,
      winDates: sorted,
      lastWinDate: sorted.length ? sorted[sorted.length - 1] : undefined,
    });
  };

  remote.forEach(absorb);
  local.forEach(absorb);

  // Newest first by createdAt.
  return Array.from(byId.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Pull the cloud copy, merge with local, persist, and push the merged result
// back. Returns the merged list to render. Safe offline (returns local).
export async function hydrateHabitsFromRemote(): Promise<UserHabit[]> {
  const local = getHabits();
  if (typeof window === "undefined") return local;
  try {
    const { getRemoteHabits } = await import("./db");
    const remoteRaw = await getRemoteHabits();
    if (!remoteRaw) {
      // Nothing in the cloud yet — seed it from local so other devices get it.
      if (local.length) pushRemote(local);
      return local;
    }
    const remote = remoteRaw as UserHabit[];
    const merged = mergeHabits(local, remote);
    persist(merged);
    pushRemote(merged);
    return merged;
  } catch {
    return local;
  }
}

export function addHabit(label: string, kind: HabitKind): UserHabit {
  const habit: UserHabit = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    label: label.trim(),
    kind,
    createdAt: new Date().toISOString(),
    winDates: [],
  };
  const habits = getHabits();
  habits.unshift(habit);
  persist(habits);
  pushRemote(habits);
  return habit;
}

export function deleteHabit(id: string): void {
  const next = getHabits().filter((h) => h.id !== id);
  persist(next);
  pushRemote(next);
}

// Toggle today's win for a habit. Returns the updated habit (or null if gone).
export function toggleWinToday(id: string): UserHabit | null {
  const habits = getHabits();
  const today = todayString();
  let updated: UserHabit | null = null;

  for (const h of habits) {
    if (h.id !== id) continue;
    const dates = new Set(h.winDates || []);
    if (dates.has(today)) {
      dates.delete(today);
    } else {
      dates.add(today);
    }
    const sorted = Array.from(dates).sort();
    h.winDates = sorted;
    h.lastWinDate = sorted.length ? sorted[sorted.length - 1] : undefined;
    updated = h;
  }

  persist(habits);
  pushRemote(habits);
  return updated;
}

export function wonToday(habit: UserHabit): boolean {
  return (habit.winDates || []).includes(todayString());
}

// Consecutive-day streak ending today or yesterday (forgiving: today not-yet-done
// doesn't break it).
export function habitStreak(habit: UserHabit): number {
  const set = new Set(habit.winDates || []);
  if (set.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 400; i++) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const ds = `${y}-${m}-${d}`;
    if (set.has(ds)) {
      streak++;
    } else if (i === 0) {
      // today not logged yet — keep looking back without breaking
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function winCount(habit: UserHabit): number {
  return (habit.winDates || []).length;
}
