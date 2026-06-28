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
    pink: "text-[#9DC1A5]",    // company salmon
    green: "text-[#9DC1A5]",   // company sage
    purple: "text-[#9DC1A5]",  // company sky blue
    orange: "text-[#79A98C]",  // company amber
  };

  const bgClasses = {
    pink: "bg-[#9DC1A5]/10",
    green: "bg-[#9DC1A5]/10",
    purple: "bg-[#9DC1A5]/15",
    orange: "bg-[#79A98C]/10",
  };

  return (
    <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-4 border border-[#F0E9CE] dark:border-[#3D3730]">
      <div className={`w-9 h-9 rounded-xl ${bgClasses[color]} flex items-center justify-center mb-3`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-0.5`}>
        {value}
      </div>
      <div className="text-[11px] text-[#8A7F78] font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
