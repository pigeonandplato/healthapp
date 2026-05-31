// Break reminder utilities.
//
// Two layers of reminders:
//  1. In-session notifications — while the app/tab is open we schedule
//     Notification popups via setTimeout. Works without a backend.
//  2. Calendar (.ics) export — a downloadable file with recurring daily
//     reminders the user's phone/computer fires reliably even when the app
//     is closed. This is the dependable path for ADHD-friendly nudges.

export type Reminder = {
  id: string;
  label: string;
  time: string; // "HH:MM" 24h
  enabled: boolean;
};

const STORAGE_KEY = "breakReminders";

export const DEFAULT_REMINDERS: Reminder[] = [
  { id: "break1", label: "☀️ Break 1 — Back Armor", time: "09:30", enabled: true },
  { id: "break2", label: "🦵 Break 2 — Knee Strength", time: "12:30", enabled: true },
  { id: "break3", label: "🚶 Break 3 — Walk + Control", time: "16:30", enabled: true },
];

export function loadReminders(): Reminder[] {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDERS;
    const parsed = JSON.parse(raw) as Reminder[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_REMINDERS;
    return parsed;
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders: Reminder[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

let timeouts: number[] = [];

export function clearScheduledReminders(): void {
  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
}

// Schedule today's remaining reminders for the current session.
export function scheduleTodayReminders(reminders: Reminder[]): void {
  clearScheduledReminders();
  if (notificationPermission() !== "granted") return;

  const now = new Date();
  reminders
    .filter((r) => r.enabled)
    .forEach((r) => {
      const [h, m] = r.time.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return;
      const when = new Date();
      when.setHours(h, m, 0, 0);
      const delay = when.getTime() - now.getTime();
      if (delay <= 0) return; // already passed today
      // setTimeout caps at ~24.8 days; our delays are always < 24h so this is safe.
      const id = window.setTimeout(() => {
        try {
          new Notification("Time for your break 💪", {
            body: r.label,
            icon: "/icons/icon-192x192.png",
            tag: r.id,
          });
        } catch {
          /* ignore */
        }
      }, delay);
      timeouts.push(id);
    });
}

function icsTime(time: string): string {
  const [h, m] = time.split(":");
  return `${h.padStart(2, "0")}${m.padStart(2, "0")}00`;
}

// Build a calendar file with a daily recurring event per enabled reminder.
export function buildReminderIcs(reminders: Reminder[]): string {
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const today = new Date();
  const y = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateStr = `${y}${mo}${d}`;

  const events = reminders
    .filter((r) => r.enabled)
    .map((r) => {
      const start = `${dateStr}T${icsTime(r.time)}`;
      return [
        "BEGIN:VEVENT",
        `UID:${r.id}-${dtstamp}@health-tracker`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${start}`,
        "DURATION:PT15M",
        "RRULE:FREQ=DAILY",
        `SUMMARY:${r.label}`,
        "DESCRIPTION:Open Health Tracker and do this break (10-15 min).",
        "BEGIN:VALARM",
        "TRIGGER:PT0M",
        "ACTION:DISPLAY",
        `DESCRIPTION:${r.label}`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Health Tracker//Break Reminders//EN",
    "CALSCALE:GREGORIAN",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadReminderIcs(reminders: Reminder[]): void {
  const ics = buildReminderIcs(reminders);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "break-reminders.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
