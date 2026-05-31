"use client";

import { LevelInfo } from "@/lib/gamification";

interface LevelBarProps {
  level: LevelInfo;
  compact?: boolean;
}

export default function LevelBar({ level, compact = false }: LevelBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center rounded-xl bg-white/20 font-black text-white ${
              compact ? "w-7 h-7 text-sm" : "w-9 h-9 text-base"
            }`}
          >
            {level.level}
          </span>
          <div className="leading-tight">
            <p className={`font-bold text-white ${compact ? "text-sm" : "text-base"}`}>
              Level {level.level}
            </p>
            <p className="text-[11px] text-white/80 -mt-0.5">{level.title}</p>
          </div>
        </div>
        <span className="text-[11px] text-white/80 font-medium">
          {level.xpToNextLevel} XP to L{level.level + 1}
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/25 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all duration-700 ease-out"
          style={{ width: `${level.progressPct}%` }}
        />
      </div>
    </div>
  );
}
