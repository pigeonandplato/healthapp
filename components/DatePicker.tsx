"use client";

import { useState, useEffect, useRef } from "react";
import { getGymDayForDate } from "@/lib/db";
import {
  toLocalDateString,
  parseLocalDate,
  formatShortDate,
  formatLongDate,
  dateOnOrAfterWeekday,
  isValidIsoDate,
} from "@/lib/dates";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  /** Show knee-day hints + Mon/Wed/Fri quick jumps (ADHD program). */
  showKneeDayHints?: boolean;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  showKneeDayHints = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const today = toLocalDateString(new Date());
  const defaultMinDate = minDate || "2024-01-01";
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const defaultMaxDate = maxDate || toLocalDateString(nextYear);

  useEffect(() => {
    setTempDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeAndApply();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tempDate]);

  const applyDate = (date: string) => {
    if (!isValidIsoDate(date)) return;
    setTempDate(date);
    onDateChange(date);
  };

  const closeAndApply = () => {
    if (isValidIsoDate(tempDate) && tempDate !== selectedDate) {
      onDateChange(tempDate);
    }
    setIsOpen(false);
  };

  const closeWithoutApply = () => {
    setTempDate(selectedDate);
    setIsOpen(false);
  };

  const handleDateSelect = (date: string) => {
    applyDate(date);
    setIsOpen(false);
  };

  const handleQuickSelect = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    handleDateSelect(toLocalDateString(date));
  };

  const handleNativeDateChange = (value: string) => {
    setTempDate(value);
    if (isValidIsoDate(value)) {
      applyDate(value);
      setIsOpen(false);
    }
  };

  const jumpToWeekday = (dow: number) => {
    handleDateSelect(dateOnOrAfterWeekday(today, dow));
  };

  const previewKnee = showKneeDayHints && isValidIsoDate(tempDate) ? getGymDayForDate(tempDate) : null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={closeAndApply} />
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#F6F3E9] dark:bg-[#2C2622] hover:bg-[#F0E9CE] dark:hover:bg-[#3D3730] rounded-xl transition-all text-sm font-medium text-[#1B1714] dark:text-white active:scale-95 touch-target"
        >
          <span className="text-base">📅</span>
          <span className="text-xs md:text-sm whitespace-nowrap">{formatShortDate(selectedDate)}</span>
          <svg
            className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="fixed md:absolute bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-0 top-auto md:top-full md:mt-2 z-50 bg-white dark:bg-[#1B1714] rounded-t-3xl md:rounded-2xl  border-t md:border border-[#F0E9CE] dark:border-[#3D3730] p-6 md:p-4 w-full md:w-auto md:min-w-[320px] max-h-[85vh] overflow-y-auto animate-slide-up md:animate-none"
          >
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-[#D2D2D7] dark:bg-[#3D3730] rounded-full" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleQuickSelect(-1)}
                className="px-3 py-2.5 text-xs font-medium bg-[#F6F3E9] dark:bg-[#2C2622] rounded-lg text-[#1B1714] dark:text-white touch-target"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(0)}
                className="px-3 py-2.5 text-xs font-semibold bg-[#79A98C] text-white rounded-lg touch-target"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(1)}
                className="px-3 py-2.5 text-xs font-medium bg-[#F6F3E9] dark:bg-[#2C2622] rounded-lg text-[#1B1714] dark:text-white touch-target"
              >
                Tomorrow
              </button>
            </div>

            {showKneeDayHints && (
              <div className="mb-4">
                <p className="text-xs font-medium text-[#8A7F78] mb-2">Jump to knee day (Break 2)</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { dow: 1, label: "Mon", emoji: "🦵" },
                    { dow: 3, label: "Wed", emoji: "🦵" },
                    { dow: 5, label: "Fri", emoji: "🦵" },
                  ].map((b) => (
                    <button
                      key={b.dow}
                      type="button"
                      onClick={() => jumpToWeekday(b.dow)}
                      className="py-2.5 rounded-lg bg-[#79A98C]/10 text-[#79A98C] text-xs font-bold touch-target"
                    >
                      {b.emoji} {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-[#8A7F78] mb-2">Select Date</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => handleNativeDateChange(e.target.value)}
                onInput={(e) => handleNativeDateChange((e.target as HTMLInputElement).value)}
                onBlur={(e) => {
                  const v = e.target.value;
                  if (isValidIsoDate(v) && v !== selectedDate) applyDate(v);
                }}
                min={defaultMinDate}
                max={defaultMaxDate}
                className="w-full px-4 py-3 rounded-xl border border-[#F0E9CE] dark:border-[#3D3730] bg-white dark:bg-[#2C2622] text-[#1B1714] dark:text-white focus:border-[#79A98C] outline-none text-base touch-target"
              />

              {isValidIsoDate(tempDate) && (
                <div
                  className={`mt-3 rounded-xl p-3 text-sm ${
                    previewKnee?.isGymDay
                      ? "bg-[#3E7E57]/10 text-[#3E7E57]"
                      : "bg-[#79A98C]/10 text-[#79A98C]"
                  }`}
                >
                  <strong>{formatLongDate(tempDate)}</strong>
                  {showKneeDayHints && (
                    <span className="block text-xs mt-1 opacity-90">
                      {previewKnee?.isGymDay
                        ? "✓ 3 breaks today — includes Break 2 (knee)"
                        : "2 breaks only — Break 2 is Mon / Wed / Fri"}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDateSelect(tempDate)}
                className="flex-1 bg-[#79A98C] text-white font-semibold py-3 rounded-xl touch-target text-sm"
              >
                View this day
              </button>
              <button
                type="button"
                onClick={closeWithoutApply}
                className="px-4 bg-[#F6F3E9] dark:bg-[#2C2622] text-[#1B1714] dark:text-white font-medium py-3 rounded-xl touch-target text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
