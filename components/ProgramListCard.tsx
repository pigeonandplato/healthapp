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
      ? "text-[#3F6B40] hover:bg-[#3F6B40]/10 dark:text-[#87A87C] dark:hover:bg-[#3F6B40]/20"
      : "text-[#8E8E93] hover:bg-[#EDE8DC] dark:text-[#8E8E93] dark:hover:bg-[#38383A]/50";

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all ${
        isActive
          ? "border-[#4A8FA8] bg-[#4A8FA8]/10 dark:bg-[#4A8FA8]/20"
          : "border-[#EDE8DC] dark:border-[#38383A] bg-white dark:bg-[#2C2C2E]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        className={`w-full p-5 text-left rounded-2xl ${
          onSelect ? "hover:border-[#EDE8DC] dark:hover:border-[#48484A]" : "cursor-default"
        }`}
      >
        <div className="text-3xl mb-2">{program.icon}</div>
        <div className="font-bold text-[#1C1C1E] dark:text-white">{program.name}</div>
        <div className="text-xs text-[#8E8E93] dark:text-[#8E8E93] mt-1">{program.description}</div>
        {isActive && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#4A8FA8]">
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
