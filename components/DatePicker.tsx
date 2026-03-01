"use client";

import { useState, useEffect, useRef } from "react";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  minDate?: string; // Optional minimum date
  maxDate?: string; // Optional maximum date
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function DatePicker({ selectedDate, onDateChange, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const today = toLocalDateString(new Date());
  const defaultMinDate = minDate || "2024-01-01";
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const defaultMaxDate = maxDate || toLocalDateString(nextYear);

  // Update tempDate when selectedDate changes
  useEffect(() => {
    setTempDate(selectedDate);
  }, [selectedDate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when dropdown is open on mobile
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formatDisplayDate = (dateStr: string): string => {
    const date = parseLocalDate(dateStr);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === todayDate.getTime()) {
      return "Today";
    }
    
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }
    
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== todayDate.getFullYear() ? "numeric" : undefined
    });
  };

  const handleDateSelect = (date: string) => {
    setTempDate(date);
    onDateChange(date);
    setIsOpen(false);
  };

  const handleQuickSelect = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateStr = toLocalDateString(date);
    handleDateSelect(dateStr);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] rounded-xl transition-all text-sm font-medium text-[#1C1C1E] dark:text-white active:scale-95 touch-target"
        >
          <span className="text-base md:text-base">📅</span>
          <span className="text-xs md:text-sm whitespace-nowrap">{formatDisplayDate(selectedDate)}</span>
          <svg
            className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Date Picker Dropdown - Mobile: Bottom Sheet, Desktop: Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              fixed md:absolute
              bottom-0 md:bottom-auto
              left-0 md:left-auto
              right-0 md:right-0
              top-auto md:top-full
              md:mt-2
              z-50
              bg-white dark:bg-[#1C1C1E]
              rounded-t-3xl md:rounded-2xl
              shadow-2xl
              border-t md:border border-[#E5E5EA] dark:border-[#38383A]
              p-6 md:p-4
              w-full md:w-auto
              md:min-w-[320px]
              max-h-[85vh] md:max-h-none
              overflow-y-auto md:overflow-visible
              animate-slide-up md:animate-none
            `}
          >
            {/* Mobile: Drag Handle */}
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-[#D2D2D7] dark:bg-[#38383A] rounded-full" />
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleQuickSelect(-1)}
                className="px-3 py-2.5 md:py-2 text-xs md:text-xs font-medium bg-[#F2F2F7] dark:bg-[#2C2C2E] active:bg-[#E5E5EA] dark:active:bg-[#38383A] rounded-lg text-[#1C1C1E] dark:text-white transition-all touch-target"
              >
                Yesterday
              </button>
              <button
                onClick={() => handleQuickSelect(0)}
                className="px-3 py-2.5 md:py-2 text-xs md:text-xs font-medium bg-[#FF2D55] active:bg-[#FF6482] text-white rounded-lg transition-all touch-target font-semibold"
              >
                Today
              </button>
              <button
                onClick={() => handleQuickSelect(1)}
                className="px-3 py-2.5 md:py-2 text-xs md:text-xs font-medium bg-[#F2F2F7] dark:bg-[#2C2C2E] active:bg-[#E5E5EA] dark:active:bg-[#38383A] rounded-lg text-[#1C1C1E] dark:text-white transition-all touch-target"
              >
                Tomorrow
              </button>
            </div>

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                min={defaultMinDate}
                max={defaultMaxDate}
                className="w-full px-4 py-3 md:py-2 rounded-xl border border-[#E5E5EA] dark:border-[#38383A] bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none text-base md:text-sm touch-target"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 md:gap-2">
              <button
                onClick={() => handleDateSelect(tempDate)}
                className="flex-1 bg-[#FF2D55] active:bg-[#FF6482] text-white font-semibold py-3 md:py-2 rounded-xl transition-all touch-target text-sm"
              >
                Select
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] active:bg-[#E5E5EA] dark:active:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 md:py-2 rounded-xl transition-all touch-target text-sm"
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
