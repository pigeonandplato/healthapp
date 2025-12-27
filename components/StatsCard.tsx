"use client";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export default function StatsCard({
  value,
  label,
  icon,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: "from-[#0A84FF] to-[#5E5CE6]",
    green: "from-[#30D158] to-[#40CBE0]",
    purple: "from-[#BF5AF2] to-[#FF375F]",
    orange: "from-[#FF9F0A] to-[#FF375F]",
  };

  return (
    <div className="glass-modern rounded-2xl p-4 hover:scale-105 active:scale-95 transition-transform touch-target">
      <div className="flex items-center justify-between mb-1.5">
        <div className={`text-2xl font-black bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="text-xs text-white/70 font-semibold tracking-wide">{label}</div>
    </div>
  );
}

