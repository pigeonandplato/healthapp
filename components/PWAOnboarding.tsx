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
        <div className="bg-white dark:bg-[#1B1714] rounded-3xl p-6  border border-[#F0E9CE] dark:border-[#3D3730]">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-[#8A7F78] hover:text-[#1B1714] dark:hover:text-white transition-colors"
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
          <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white text-center mb-2">
            Install as App
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-[#8A7F78] text-center mb-5">
            Get Health Tracker on your home screen—just like a native app
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-[#3E7E57] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1B1714] dark:text-white">One tap to launch</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#3E7E57] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1B1714] dark:text-white">Works offline</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#3E7E57] font-bold text-lg flex-shrink-0">✓</span>
              <span className="text-sm text-[#1B1714] dark:text-white">Full-screen, no browser bars</span>
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
              className="w-full bg-[#F6F3E9] dark:bg-[#2C2622] hover:bg-[#F0E9CE] dark:hover:bg-[#3D3730] text-[#1B1714] dark:text-white font-medium py-3 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>

          {/* Hint */}
          <p className="text-xs text-[#8A7F78] text-center mt-4">
            You can find this anytime in Help → Setup
          </p>
        </div>
      </div>
    </>
  );
}
