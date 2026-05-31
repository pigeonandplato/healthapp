"use client";

import { useState, useEffect } from "react";
import {
  Reminder,
  loadReminders,
  saveReminders,
  notificationPermission,
  requestNotificationPermission,
  scheduleTodayReminders,
  downloadReminderIcs,
} from "@/lib/reminders";

export default function ReminderSettings() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setReminders(loadReminders());
    setPermission(notificationPermission());
  }, []);

  const persist = (next: Reminder[]) => {
    setReminders(next);
    saveReminders(next);
    scheduleTodayReminders(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const updateReminder = (id: string, patch: Partial<Reminder>) => {
    persist(reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      scheduleTodayReminders(reminders);
      try {
        new Notification("Reminders on 🎉", { body: "We'll nudge you for each break today." });
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Notification permission */}
      {permission === "unsupported" ? (
        <div className="bg-[#FF9500]/10 text-[#FF9500] text-sm rounded-xl p-3">
          This browser doesn&apos;t support in-app notifications. Use the calendar export below for reliable reminders.
        </div>
      ) : permission === "granted" ? (
        <div className="bg-[#34C759]/10 text-[#34C759] text-sm rounded-xl p-3 font-medium">
          ✓ In-app notifications on. We&apos;ll nudge you while the app is open.
        </div>
      ) : (
        <button
          onClick={handleEnableNotifications}
          className="w-full bg-[#007AFF] hover:brightness-95 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98]"
        >
          🔔 Enable in-app notifications
        </button>
      )}

      {/* Reminder rows */}
      <div className="space-y-3">
        {reminders.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl p-3"
          >
            <button
              onClick={() => updateReminder(r.id, { enabled: !r.enabled })}
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                r.enabled ? "bg-[#34C759]" : "bg-[#C7C7CC] dark:bg-[#48484A]"
              }`}
              aria-pressed={r.enabled}
              aria-label={`Toggle ${r.label}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  r.enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${r.enabled ? "text-[#1C1C1E] dark:text-white" : "text-[#8E8E93]"}`}>
                {r.label}
              </p>
            </div>
            <input
              type="time"
              value={r.time}
              onChange={(e) => updateReminder(r.id, { time: e.target.value })}
              className="!py-1.5 !px-2 text-sm rounded-lg bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] text-[#1C1C1E] dark:text-white flex-shrink-0"
            />
          </div>
        ))}
      </div>

      {saved && <p className="text-xs text-[#34C759] font-medium">Saved ✓</p>}

      {/* Calendar export */}
      <div className="border-t border-[#E5E5EA] dark:border-[#38383A] pt-4">
        <p className="text-sm text-[#8E8E93] mb-3">
          Want reminders even when the app is closed? Add them to your phone&apos;s calendar — they&apos;ll repeat daily.
        </p>
        <button
          onClick={() => downloadReminderIcs(reminders)}
          className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all"
        >
          📅 Add to calendar (recurring)
        </button>
      </div>
    </div>
  );
}
