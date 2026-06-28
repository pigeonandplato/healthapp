"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ONBOARDING_SEEN_KEY = "pwa-onboarding-seen";

export default function PWAOnboarding() {
  const [shown, setShown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the onboarding
    const seen = localStorage.getItem(ONBOARDING_SEEN_KEY);
    if (!seen) {
      // Show after a brief delay for better UX
      const timer = setTimeout(() => {
        setShown(true);
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as seen after fade out
    setTimeout(() => {
      localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    }, 300);
  };

  if (!shown) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6  border border-[#E5E5EA] dark:border-[#38383A]">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Icon */}
          <div className="text-6xl text-center mb-4">📱</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#1C1C1E] dark:text-white text-center mb-2">
            Install as App
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-[#8E8E93] text-center mb-5">
            Get Health Tracker on your home screen—just like a native app
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-[#34C759] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1C1C1E] dark:text-white">One tap to launch</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#34C759] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1C1C1E] dark:text-white">Works offline</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#34C759] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1C1C1E] dark:text-white">Full-screen, no browser bars</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/help"
              onClick={handleDismiss}
              className="block w-full bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 rounded-xl text-center transition-all active:scale-95"
            >
              How to Install
            </Link>
            <button
              onClick={handleDismiss}
              className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>

          {/* Hint */}
          <p className="text-xs text-[#8E8E93] text-center mt-4">
            You can find this anytime in Help → Setup
          </p>
        </div>
      </div>
    </>
  );
}
