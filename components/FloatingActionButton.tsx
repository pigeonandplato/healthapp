"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FloatingActionButtonProps {
  onQuickComplete?: () => void;
  onAddNote?: () => void;
  onStartTimer?: () => void;
}

export default function FloatingActionButton({
  onQuickComplete,
  onAddNote,
  onStartTimer,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="mb-4 space-y-3 animate-fade-in">
          {onQuickComplete && (
            <button
              onClick={() => {
                onQuickComplete();
                setIsOpen(false);
              }}
              className="w-14 h-14 rounded-full bg-[#34C759] shadow-lg flex items-center justify-center text-white text-xl transform transition-all hover:scale-110 active:scale-95"
              title="Quick Complete"
            >
              ✓
            </button>
          )}
          {onStartTimer && (
            <button
              onClick={() => {
                onStartTimer();
                setIsOpen(false);
              }}
              className="w-14 h-14 rounded-full bg-[#FF9500] shadow-lg flex items-center justify-center text-white text-xl transform transition-all hover:scale-110 active:scale-95"
              title="Start Timer"
            >
              ⏱
            </button>
          )}
          {onAddNote && (
            <button
              onClick={() => {
                onAddNote();
                setIsOpen(false);
              }}
              className="w-14 h-14 rounded-full bg-[#5856D6] shadow-lg flex items-center justify-center text-white text-xl transform transition-all hover:scale-110 active:scale-95"
              title="Add Note"
            >
              📝
            </button>
          )}
          <button
            onClick={() => router.push("/progress")}
            className="w-14 h-14 rounded-full bg-[#FF2D55] shadow-lg flex items-center justify-center text-white text-xl transform transition-all hover:scale-110 active:scale-95"
            title="View Progress"
          >
            📊
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[#FF2D55] shadow-2xl flex items-center justify-center text-white text-2xl transform transition-all hover:scale-110 active:scale-95"
        aria-label="Quick Actions"
      >
        {isOpen ? "✕" : "+"}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

