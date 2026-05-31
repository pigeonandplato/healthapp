"use client";

interface WeeklyRecapProps {
  completedDates: Set<string>;
  streak?: number;
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export default function WeeklyRecap({ completedDates, streak }: WeeklyRecapProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateString(today);

  // Start of this week = Monday.
  const dow = today.getDay(); // 0=Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = toLocalDateString(d);
    return {
      letter: DAY_LETTERS[i],
      date: ds,
      completed: completedDates.has(ds),
      isToday: ds === todayStr,
      isFuture: d.getTime() > today.getTime(),
    };
  });

  const activeThisWeek = days.filter((d) => d.completed).length;

  let message: string;
  if (activeThisWeek === 0) {
    message = "A fresh week. One small win gets it rolling.";
  } else if (activeThisWeek >= 5) {
    message = "Incredible week — you're on fire. 🔥";
  } else if (activeThisWeek >= 3) {
    message = "Strong week. Keep stacking days.";
  } else {
    message = "Good start. Every day you show up counts.";
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white">This Week</h3>
        <span className="text-sm font-bold text-[#FF2D55]">{activeThisWeek}/7 days</span>
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-3">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-semibold text-[#8E8E93]">{d.letter}</span>
            <div
              className={`w-full aspect-square max-w-[40px] rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                d.completed
                  ? "bg-[#34C759] text-white shadow-sm"
                  : d.isFuture
                    ? "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#C7C7CC] dark:text-[#48484A]"
                    : "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#C7C7CC] dark:text-[#48484A]"
              } ${d.isToday ? "ring-2 ring-[#FF2D55]" : ""}`}
            >
              {d.completed ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8E8E93]">{message}</p>
        {typeof streak === "number" && streak > 0 && (
          <span className="text-xs font-semibold text-[#FF9500] flex-shrink-0 ml-2">🔥 {streak}-day streak</span>
        )}
      </div>
    </div>
  );
}
