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
      ? "text-[#3E7E57] hover:bg-[#3E7E57]/10 dark:text-[#9DC1A5] dark:hover:bg-[#3E7E57]/20"
      : "text-[#8A7F78] hover:bg-[#F0E9CE] dark:text-[#8A7F78] dark:hover:bg-[#3D3730]/50";

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all ${
        isActive
          ? "border-[#79A98C] bg-[#79A98C]/10 dark:bg-[#79A98C]/20"
          : "border-[#F0E9CE] dark:border-[#3D3730] bg-white dark:bg-[#2C2622]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        className={`w-full p-5 text-left rounded-2xl ${
          onSelect ? "hover:border-[#F0E9CE] dark:hover:border-[#4A433E]" : "cursor-default"
        }`}
      >
        <div className="text-3xl mb-2">{program.icon}</div>
        <div className="font-bold text-[#1B1714] dark:text-white">{program.name}</div>
        <div className="text-xs text-[#8A7F78] dark:text-[#8A7F78] mt-1">{program.description}</div>
        {isActive && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#79A98C]">
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
