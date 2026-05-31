"use client";

import { useState } from "react";
import { buildMonthGrid } from "@/lib/gamification";

interface ConsistencyCalendarProps {
  completedDates: Set<string>;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ConsistencyCalendar({ completedDates }: ConsistencyCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const cells = buildMonthGrid(year, month, completedDates);
  const monthDays = cells.filter((c) => c.inMonth);
  const doneThisMonth = monthDays.filter((c) => c.completed).length;
  const pastDays = monthDays.filter((c) => !c.isFuture).length;

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return; // don't navigate into the future
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          className="w-9 h-9 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1C1C1E] dark:text-white"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold text-[#1C1C1E] dark:text-white">
            {MONTHS[month]} {year}
          </p>
          <p className="text-xs text-[#8E8E93]">
            {doneThisMonth} of {pastDays} days active
          </p>
        </div>
        <button
          onClick={goNext}
          disabled={isCurrentMonth}
          className="w-9 h-9 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1C1C1E] dark:text-white disabled:opacity-30"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-[#8E8E93]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={i} />;
          const dayNum = Number(cell.date.split("-")[2]);
          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                cell.completed
                  ? "bg-[#34C759] text-white shadow-sm"
                  : cell.isFuture
                    ? "bg-[#F2F2F7] dark:bg-[#1C1C1E] text-[#C7C7CC] dark:text-[#48484A]"
                    : "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93]"
              } ${cell.isToday ? "ring-2 ring-[#FF2D55]" : ""}`}
              title={cell.completed ? `${cell.date} — active` : cell.date}
            >
              {cell.completed ? "✓" : dayNum}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8E8E93] mt-4 text-center">
        Green = you showed up. Miss a day? Just fill in the next one — progress is never lost.
      </p>
    </div>
  );
}
