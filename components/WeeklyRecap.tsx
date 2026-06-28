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
    <div className="rounded-2xl bg-white dark:bg-[#1B1714] border border-[#F0E9CE] dark:border-[#3D3730] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#1B1714] dark:text-white">This Week</h3>
        <span className="text-sm font-bold text-[#79A98C]">{activeThisWeek}/7 days</span>
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-3">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-semibold text-[#8A7F78]">{d.letter}</span>
            <div
              className={`w-full aspect-square max-w-[40px] rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                d.completed
                  ? "bg-[#9DC1A5] text-white shadow-sm"
                  : d.isFuture
                    ? "bg-[#F0E9CE] dark:bg-[#2C2622] text-[#C5BDB6] dark:text-[#4A433E]"
                    : "bg-[#F0E9CE] dark:bg-[#2C2622] text-[#C5BDB6] dark:text-[#4A433E]"
              } ${d.isToday ? "ring-2 ring-[#79A98C]" : ""}`}
            >
              {d.completed ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A7F78]">{message}</p>
        {typeof streak === "number" && streak > 0 && (
          <span className="text-xs font-semibold text-[#E5B122] flex-shrink-0 ml-2">🔥 {streak}-day streak</span>
        )}
      </div>
    </div>
  );
}
