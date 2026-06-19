"use client";

import type { ProgramInfo } from "@/lib/types";

interface ProgramListCardProps {
  program: ProgramInfo;
  isActive?: boolean;
  onSelect?: () => void;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "archive" | "restore";
  };
}

export default function ProgramListCard({
  program,
  isActive = false,
  onSelect,
  action,
}: ProgramListCardProps) {
  const actionClass =
    action?.variant === "restore"
      ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50";

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all ${
        isActive
          ? "border-[#FF2D55] bg-[#FF2D55]/10 dark:bg-[#FF2D55]/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        className={`w-full p-5 text-left rounded-2xl ${
          onSelect ? "hover:border-gray-300 dark:hover:border-gray-600" : "cursor-default"
        }`}
      >
        <div className="text-3xl mb-2">{program.icon}</div>
        <div className="font-bold text-gray-900 dark:text-white">{program.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{program.description}</div>
        {isActive && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FF2D55]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Active
          </div>
        )}
      </button>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${actionClass}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
