"use client";

import { useState } from "react";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  minDate?: string; // Optional minimum date
  maxDate?: string; // Optional maximum date
}

export default function DatePicker({ selectedDate, onDateChange, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  const today = new Date().toISOString().split("T")[0];
  const defaultMinDate = minDate || "2024-01-01";
  const defaultMaxDate = maxDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0];

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    if (dateOnly.getTime() === today.getTime()) {
      return "Today";
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateOnly.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateOnly.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
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
    const dateStr = date.toISOString().split("T")[0];
    handleDateSelect(dateStr);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] rounded-xl transition-all text-sm font-medium text-[#1C1C1E] dark:text-white"
      >
        <span>📅</span>
        <span>{formatDisplayDate(selectedDate)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Date Picker Dropdown */}
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl border border-[#E5E5EA] dark:border-[#38383A] p-4 z-50 min-w-[280px]">
            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleQuickSelect(-1)}
                className="px-3 py-2 text-xs font-medium bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] rounded-lg text-[#1C1C1E] dark:text-white transition-all"
              >
                Yesterday
              </button>
              <button
                onClick={() => handleQuickSelect(0)}
                className="px-3 py-2 text-xs font-medium bg-[#FF2D55] hover:bg-[#FF6482] text-white rounded-lg transition-all"
              >
                Today
              </button>
              <button
                onClick={() => handleQuickSelect(1)}
                className="px-3 py-2 text-xs font-medium bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] rounded-lg text-[#1C1C1E] dark:text-white transition-all"
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
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5EA] dark:border-[#38383A] bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDateSelect(tempDate)}
                className="flex-1 bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-2 rounded-xl transition-all"
              >
                Select
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

