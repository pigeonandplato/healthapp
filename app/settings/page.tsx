"use client";

import { useState, useEffect } from "react";
import { getYouTubeVideo, saveYouTubeVideo } from "@/lib/db";
import YouTubeVideoEditor from "@/components/YouTubeVideoEditor";
import GoogleSheetsImport from "@/components/GoogleSheetsImport";
import ReminderSettings from "@/components/ReminderSettings";
import { isSoundEnabled, setSoundEnabled, playCompletionChime } from "@/utils/haptics";

export default function SettingsPage() {
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    loadSettings();
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCompletionChime(); // preview the sound when turning it on
  };

  async function loadSettings() {
    setLoading(true);
    try {
      const url = await getYouTubeVideo();
      setYoutubeUrl(url || "");
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D55]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E] dark:text-white mb-6">Settings</h1>

        {/* Completion Sound Section */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-1">🔊 Completion Sound</h2>
              <p className="text-sm text-[#8E8E93]">
                Play a little chime each time you check off an exercise. An instant audio reward — on by choice, off if it&apos;s too much.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={soundOn}
              onClick={toggleSound}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
                soundOn ? "bg-[#34C759]" : "bg-[#E5E5EA] dark:bg-[#38383A]"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  soundOn ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Break Reminders Section */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-1">⏰ Break Reminders</h2>
          <p className="text-sm text-[#8E8E93] mb-4">
            Get nudged for each of your daily breaks. Out of sight is out of mind — these keep you on track.
          </p>
          <ReminderSettings />
        </div>

        {/* YouTube Video Section */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-4">
            Motivation Video
          </h2>
          <p className="text-sm text-[#8E8E93] mb-4">
            Add a YouTube video link to help you stay motivated and maintain discipline.
          </p>
          <YouTubeVideoEditor
            initialUrl={youtubeUrl}
            onSave={async (url) => {
              await saveYouTubeVideo(url);
              setYoutubeUrl(url);
            }}
          />
        </div>

        {/* Google Sheets Import Section */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          <h2 className="text-lg font-semibold text-[#1C1C1E] dark:text-white mb-4">
            Import Custom Program
          </h2>
          <p className="text-sm text-[#8E8E93] mb-4">
            Upload a CSV or Excel file to create a custom workout program. Download the template to see the required format.
          </p>
          <GoogleSheetsImport />
        </div>
      </div>
    </div>
  );
}

