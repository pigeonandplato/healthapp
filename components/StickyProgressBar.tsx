"use client";

interface StickyProgressBarProps {
  progress: number;
}

export default function StickyProgressBar({ progress }: StickyProgressBarProps) {
  return (
    <div className="fixed top-[60px] left-0 right-0 h-1 bg-[#F0E9CE] dark:bg-[#3D3730] z-40">
      <div
        className="h-full"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          background: 'linear-gradient(90deg, #9DC1A5, #79A98C)',
          transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  );
}
