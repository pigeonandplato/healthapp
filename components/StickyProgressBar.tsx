"use client";

interface StickyProgressBarProps {
  progress: number;
}

export default function StickyProgressBar({ progress }: StickyProgressBarProps) {
  return (
    <div className="fixed top-[60px] left-0 right-0 h-1 bg-[#EDE8DC] dark:bg-[#38383A] z-40">
      <div
        className="h-full bg-gradient-to-r from-[#EF9D8C] to-[#CF9030] transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
