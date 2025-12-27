"use client";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: string;
  color?: "pink" | "green" | "purple" | "orange";
}

export default function StatsCard({
  value,
  label,
  icon,
  color = "pink",
}: StatsCardProps) {
  const colorClasses = {
    pink: "text-[#FF2D55]",
    green: "text-[#34C759]",
    purple: "text-[#AF52DE]",
    orange: "text-[#FF9500]",
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A] shadow-minimal">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
        <div className="text-xl opacity-80">{icon}</div>
      </div>
      <div className="text-xs text-[#8E8E93] font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
