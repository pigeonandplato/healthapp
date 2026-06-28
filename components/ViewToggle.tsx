"use client";

import { ViewMode } from "@/lib/types";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-[#F0E9CE] dark:border-[#3D3730] bg-white dark:bg-[#2C2622] p-1 shadow-sm">
      <button
        onClick={() => onViewChange("checklist")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === "checklist"
            ? "bg-[#79A98C] text-white shadow-sm"
            : "text-[#3D3730] dark:text-[#D4CFC9] hover:text-[#1B1714] dark:hover:text-white"
        }`}
        aria-pressed={currentView === "checklist"}
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Checklist
        </span>
      </button>
      
      <button
        onClick={() => onViewChange("coach")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === "coach"
            ? "bg-[#79A98C] text-white shadow-sm"
            : "text-[#3D3730] dark:text-[#D4CFC9] hover:text-[#1B1714] dark:hover:text-white"
        }`}
        aria-pressed={currentView === "coach"}
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Coach
        </span>
      </button>
    </div>
  );
}



