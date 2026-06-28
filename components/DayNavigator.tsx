"use client";

import { addDays, formatLongDate, formatShortDate, isValidIsoDate, toLocalDateString } from "@/lib/dates";
import type { ProgramType } from "@/lib/types";
import { getTrainingWeekdays, nextTrainingDate, prevTrainingDate } from "@/lib/workoutNavigation";

interface DayNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  program?: ProgramType;
  subtitle?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export default function DayNavigator({
  selectedDate,
  onDateChange,
  program,
  subtitle,
  minDate,
  maxDate,
  className = "",
}: DayNavigatorProps) {
  const today = toLocalDateString(new Date());
  const isToday = selectedDate === today;
  const trainingDays = program ? getTrainingWeekdays(program) : null;
  const hasWorkoutShortcuts = trainingDays !== null && trainingDays.length < 7;

  const canGoPrev = !minDate || selectedDate > minDate;
  const canGoNext = !maxDate || selectedDate < maxDate;

  const shiftDay = (delta: number) => {
    const next = addDays(selectedDate, delta);
    if (minDate && next < minDate) return;
    if (maxDate && next > maxDate) return;
    if (isValidIsoDate(next)) onDateChange(next);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => shiftDay(-1)}
          disabled={!canGoPrev}
          aria-label="Previous day"
          className="flex-shrink-0 px-3 py-3 rounded-xl bg-[#EDE8DC] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E0D9C8] dark:hover:bg-[#38383A] transition-colors touch-target"
        >
          ←
        </button>

        <div className="flex-1 min-w-0 rounded-xl bg-[#EDE8DC] dark:bg-[#2C2C2E] px-3 py-2 flex flex-col justify-center text-center">
          <p className="text-sm font-bold text-[#1C1C1E] dark:text-white truncate">
            {formatShortDate(selectedDate)}
          </p>
          <p className="text-xs text-[#8E8E93] truncate">{formatLongDate(selectedDate)}</p>
          {subtitle && <p className="text-xs text-[#4A8FA8] font-medium mt-0.5 truncate">{subtitle}</p>}
        </div>

        <button
          type="button"
          onClick={() => shiftDay(1)}
          disabled={!canGoNext}
          aria-label="Next day"
          className="flex-shrink-0 px-3 py-3 rounded-xl bg-[#EDE8DC] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E0D9C8] dark:hover:bg-[#38383A] transition-colors touch-target"
        >
          →
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {!isToday && (
          <button
            type="button"
            onClick={() => onDateChange(today)}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-[#4A8FA8] text-white touch-target"
          >
            Jump to today
          </button>
        )}
        {hasWorkoutShortcuts && program && (
          <>
            <button
              type="button"
              onClick={() => onDateChange(prevTrainingDate(selectedDate, program))}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#4A8FA8]/10 text-[#4A8FA8] touch-target"
            >
              ← Prev workout day
            </button>
            <button
              type="button"
              onClick={() => onDateChange(nextTrainingDate(selectedDate, program))}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#4A8FA8]/10 text-[#4A8FA8] touch-target"
            >
              Next workout day →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
