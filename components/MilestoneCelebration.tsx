"use client";

import { useState, useEffect } from "react";
import { Milestone } from "@/lib/progress";

interface MilestoneCelebrationProps {
  milestones: Milestone[];
  onClose: () => void;
}

export default function MilestoneCelebration({ milestones, onClose }: MilestoneCelebrationProps) {
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (milestones.length === 0) return;
    
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [currentMilestone, milestones.length]);

  if (milestones.length === 0 || !isVisible) return null;

  const milestone = milestones[currentMilestone];
  const isLast = currentMilestone === milestones.length - 1;

  const handleNext = () => {
    if (isLast) {
      setIsVisible(false);
      onClose();
    } else {
      setCurrentMilestone(currentMilestone + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`bg-white dark:bg-[#1B1714] rounded-3xl p-8 max-w-sm w-full  transform transition-all duration-500 ${
          isAnimating ? "scale-110 rotate-3" : "scale-100 rotate-0"
        }`}
      >
        {/* Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#9DC1A5', '#79A98C', '#3E7E57', '#9DC1A5', '#5E8C6E'][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Emoji */}
          <div className="text-8xl mb-4 animate-bounce">
            {milestone.emoji}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#1B1714] dark:text-white mb-2">
            {milestone.title}
          </h2>

          {/* Description */}
          <p className="text-[#8A7F78] mb-6">
            {milestone.description}
          </p>

          {/* Progress indicator */}
          {milestones.length > 1 && (
            <div className="flex justify-center gap-2 mb-6">
              {milestones.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentMilestone
                      ? "w-8 bg-[#79A98C]"
                      : index < currentMilestone
                      ? "w-2 bg-[#79A98C]/50"
                      : "w-2 bg-[#F0E9CE] dark:bg-[#3D3730]"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleNext}
            className="w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            {isLast ? "Awesome! 🎉" : "Next Milestone →"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

