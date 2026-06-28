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
  // Map to company brand palette
  const colorClasses = {
    pink: "text-[#9DBFD0]",    // company salmon
    green: "text-[#87A87C]",   // company sage
    purple: "text-[#9DBFD0]",  // company sky blue
    orange: "text-[#4A8FA8]",  // company amber
  };

  const bgClasses = {
    pink: "bg-[#9DBFD0]/10",
    green: "bg-[#87A87C]/10",
    purple: "bg-[#9DBFD0]/15",
    orange: "bg-[#4A8FA8]/10",
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 border border-[#EDE8DC] dark:border-[#38383A]">
      <div className={`w-9 h-9 rounded-xl ${bgClasses[color]} flex items-center justify-center mb-3`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-0.5`}>
        {value}
      </div>
      <div className="text-[11px] text-[#8E8E93] font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
