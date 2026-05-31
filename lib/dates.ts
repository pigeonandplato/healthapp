/** Shared local-date helpers (always YYYY-MM-DD in local timezone). */

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLongDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Today";

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

/** Nearest on-or-after date matching targetDow (0=Sun … 6=Sat). */
export function dateOnOrAfterWeekday(fromIso: string, targetDow: number): string {
  const d = parseLocalDate(fromIso);
  for (let i = 0; i < 7; i++) {
    if (d.getDay() === targetDow) return toLocalDateString(d);
    d.setDate(d.getDate() + 1);
  }
  return toLocalDateString(d);
}

export function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
