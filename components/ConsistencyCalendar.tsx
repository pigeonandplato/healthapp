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
          className="w-9 h-9 rounded-full bg-[#F6F3E9] dark:bg-[#2C2622] flex items-center justify-center text-[#1B1714] dark:text-white"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold text-[#1B1714] dark:text-white">
            {MONTHS[month]} {year}
          </p>
          <p className="text-xs text-[#8A7F78]">
            {doneThisMonth} of {pastDays} days active
          </p>
        </div>
        <button
          onClick={goNext}
          disabled={isCurrentMonth}
          className="w-9 h-9 rounded-full bg-[#F6F3E9] dark:bg-[#2C2622] flex items-center justify-center text-[#1B1714] dark:text-white disabled:opacity-30"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-[#8A7F78]">
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
                  ? "bg-[#3E7E57] text-white shadow-sm"
                  : cell.isFuture
                    ? "bg-[#F6F3E9] dark:bg-[#1B1714] text-[#C5BDB6] dark:text-[#4A433E]"
                    : "bg-[#F6F3E9] dark:bg-[#2C2622] text-[#8A7F78]"
              } ${cell.isToday ? "ring-2 ring-[#E5B122]" : ""}`}
              title={cell.completed ? `${cell.date} — active` : cell.date}
            >
              {cell.completed ? "✓" : dayNum}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8A7F78] mt-4 text-center">
        Green = you showed up. Miss a day? Just fill in the next one — progress is never lost.
      </p>
    </div>
  );
}
