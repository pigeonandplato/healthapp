"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("ios");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-[#E5E5EA] dark:border-[#38383A] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/today" className="inline-flex items-center gap-2 text-[#FF2D55] hover:opacity-70 mb-3">
            <span>←</span>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1C1C1E] dark:text-white">Help & Setup</h1>
          <p className="text-sm text-[#8E8E93] mt-1">Install Health Tracker as an app on your phone</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Why Install Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#FF2D55]/10 to-[#FF6482]/10 dark:from-[#FF2D55]/20 dark:to-[#FF6482]/20 rounded-2xl p-6 border border-[#FF2D55]/20 dark:border-[#FF2D55]/30">
            <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Install as an App
            </h2>
            <p className="text-sm text-[#8E8E93] mb-4">
              Health Tracker works great as a full-screen app on your phone—just like a native app from the App Store. No installation or downloads needed.
            </p>
            <ul className="space-y-2 text-sm text-[#8E8E93]">
              <li className="flex items-start gap-2">
                <span className="text-[#34C759] font-bold mt-0.5">✓</span>
                <span>Opens full-screen on home screen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34C759] font-bold mt-0.5">✓</span>
                <span>Works completely offline after first visit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34C759] font-bold mt-0.5">✓</span>
                <span>No browser address bar or buttons—feels native</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34C759] font-bold mt-0.5">✓</span>
                <span>One tap to launch your workouts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* iOS Instructions */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("ios")}
            className={`w-full bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border transition-all ${
              expandedSection === "ios"
                ? "border-[#007AFF]/50 dark:border-[#007AFF]/50"
                : "border-[#E5E5EA] dark:border-[#38383A] hover:border-[#E5E5EA] dark:hover:border-[#38383A]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 text-left">
                <span className="text-4xl">🍎</span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">iPhone / iPad (iOS)</h3>
                  <p className="text-sm text-[#8E8E93]">Install via Safari</p>
                </div>
              </div>
              <span className={`text-2xl transition-transform ${expandedSection === "ios" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
          </button>

          {expandedSection === "ios" && (
            <div className="bg-white dark:bg-[#1C1C1E] border border-t-0 border-[#E5E5EA] dark:border-[#38383A] rounded-b-2xl p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#FF2D55] flex-shrink-0 w-8 text-center">1</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-1">Open Health Tracker in Safari</p>
                    <p className="text-sm text-[#8E8E93]">Make sure you're viewing this page in Safari (not Chrome or another browser)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#FF2D55] flex-shrink-0 w-8 text-center">2</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Tap the Share button</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      Look for the box with an arrow pointing up at the bottom center (or top right, depending on your iOS version)
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#FF2D55] flex-shrink-0 w-8 text-center">3</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Scroll and tap "Add to Home Screen"</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      Scroll through the options until you see this—it might not be visible at first glance
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#FF2D55] flex-shrink-0 w-8 text-center">4</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Choose name (optional) and tap "Add"</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      You can rename it to something shorter like "Workouts" if you want
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#FF2D55] flex-shrink-0 w-8 text-center">5</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white">Done! 🎉</p>
                    <p className="text-sm text-[#8E8E93] mt-1">Look for Health Tracker on your home screen. Tap it to launch the app anytime.</p>
                  </div>
                </div>
              </div>

              {/* iOS Tip */}
              <div className="bg-[#007AFF]/5 dark:bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-lg p-4">
                <p className="text-sm text-[#007AFF] font-medium mb-1">💡 Tip</p>
                <p className="text-sm text-[#8E8E93]">
                  Not seeing "Add to Home Screen"? Make sure you're using Safari. Chrome and other browsers work differently on iOS.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Android Instructions */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("android")}
            className={`w-full bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border transition-all ${
              expandedSection === "android"
                ? "border-[#34C759]/50 dark:border-[#34C759]/50"
                : "border-[#E5E5EA] dark:border-[#38383A] hover:border-[#E5E5EA] dark:hover:border-[#38383A]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 text-left">
                <span className="text-4xl">🤖</span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">Android</h3>
                  <p className="text-sm text-[#8E8E93]">Install via Chrome</p>
                </div>
              </div>
              <span className={`text-2xl transition-transform ${expandedSection === "android" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
          </button>

          {expandedSection === "android" && (
            <div className="bg-white dark:bg-[#1C1C1E] border border-t-0 border-[#E5E5EA] dark:border-[#38383A] rounded-b-2xl p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#34C759] flex-shrink-0 w-8 text-center">1</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-1">Open Health Tracker in Chrome</p>
                    <p className="text-sm text-[#8E8E93]">Chrome gives the best app-like experience on Android</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#34C759] flex-shrink-0 w-8 text-center">2</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Tap the three dots (menu)</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      Found in the top right corner of Chrome
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#34C759] flex-shrink-0 w-8 text-center">3</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Tap "Install app"</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      This option appears when a site is installable as a PWA
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#34C759] flex-shrink-0 w-8 text-center">4</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Confirm the installation</p>
                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-3 text-sm text-[#8E8E93] mb-2">
                      A dialog will ask if you want to add Health Tracker to your home screen. Tap "Install".
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-[#34C759] flex-shrink-0 w-8 text-center">5</div>
                  <div>
                    <p className="font-medium text-[#1C1C1E] dark:text-white">Done! 🎉</p>
                    <p className="text-sm text-[#8E8E93] mt-1">The app is now on your home screen. Tap it anytime to launch full-screen.</p>
                  </div>
                </div>
              </div>

              {/* Android Tip */}
              <div className="bg-[#34C759]/5 dark:bg-[#34C759]/10 border border-[#34C759]/20 rounded-lg p-4">
                <p className="text-sm text-[#34C759] font-medium mb-1">💡 Tip</p>
                <p className="text-sm text-[#8E8E93]">
                  Don't see "Install app"? Make sure you're using a recent version of Chrome. Other browsers like Firefox and Edge also support PWA installation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Instructions */}
        <div className="mb-8">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border border-[#E5E5EA] dark:border-[#38383A]">
            <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">💻</span>
              Desktop
            </h3>
            <p className="text-sm text-[#8E8E93] mb-4">
              On desktop browsers (Chrome, Edge, Safari), you can also install Health Tracker. Look for an "Install app" prompt in the address bar or menu.
            </p>
            <p className="text-sm text-[#8E8E93]">
              This makes it easy to access on your computer while you're working. Perfect for planning your workouts or tracking progress.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-[#E5E5EA] dark:border-[#38383A] pt-8">
          <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-6">Questions?</h2>

          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A]">
              <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Can I use Health Tracker without installing it?</p>
              <p className="text-sm text-[#8E8E93]">
                Yes! You can always visit the website in your browser. But installing makes it feel more like a native app and is much more convenient.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A]">
              <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Will it work offline?</p>
              <p className="text-sm text-[#8E8E93]">
                Absolutely. After you first visit, everything is stored on your phone. You can track workouts, view your data, and use all features without internet.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A]">
              <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Is this a real app or just a website?</p>
              <p className="text-sm text-[#8E8E93]">
                It's a Progressive Web App (PWA)—a modern web technology that lets apps work like native apps. No App Store needed, no downloads, no installation delays.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A]">
              <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Can I uninstall it?</p>
              <p className="text-sm text-[#8E8E93]">
                Yes—just like any app. Long-press the icon on your home screen and select "Remove" (iOS) or "Uninstall" (Android).
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-[#E5E5EA] dark:border-[#38383A]">
              <p className="font-medium text-[#1C1C1E] dark:text-white mb-2">Does it take up storage?</p>
              <p className="text-sm text-[#8E8E93]">
                Very little—just a few MB for your data. Much smaller than typical app downloads.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#FF2D55] to-[#FF6482] rounded-2xl p-6 text-center">
          <p className="text-white font-medium mb-3">Ready to get started?</p>
          <Link
            href="/today"
            className="inline-block bg-white text-[#FF2D55] font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Go to Workouts
          </Link>
        </div>
      </div>
    </div>
  );
}
