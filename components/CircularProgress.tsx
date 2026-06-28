"use client";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-[#EDE8DC] dark:text-[#3A3A3C]"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        {/* Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9DBFD0" />
            <stop offset="50%" stopColor="#4A8FA8" />
            <stop offset="100%" stopColor="#38788F" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold bg-gradient-to-r from-[#4A8FA8] to-[#9DBFD0] bg-clip-text text-transparent">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-xs text-[#8E8E93] dark:text-[#8E8E93] mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}



