"use client";

import { Achievement } from "@/lib/gamification";

interface AchievementsGridProps {
  achievements: Achievement[];
}

export default function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div>
      <p className="text-xs text-[#8A7F78] mb-4">
        {earnedCount} of {achievements.length} earned
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl p-3 text-center border transition-all ${
              a.earned
                ? "bg-[#E5B122]/8 border-[#E5B122]/30"
                : "bg-[#F6F3E9] dark:bg-[#2C2622] border-transparent opacity-50 grayscale"
            }`}
            title={a.description}
          >
            <div className="text-3xl mb-1">{a.earned ? a.emoji : "🔒"}</div>
            <p className="text-[11px] font-bold text-[#1B1714] dark:text-white leading-tight">{a.title}</p>
            <p className="text-[10px] text-[#8A7F78] mt-0.5 leading-tight">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
