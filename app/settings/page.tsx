"use client";

import { useState, useEffect } from "react";
import { getYouTubeVideo, saveYouTubeVideo, getCompletionSoundSetting, setCompletionSoundSetting, clearChachaVideoOverrides, getCustomProgram, getCustomProgramName, getActiveProgram } from "@/lib/db";
import YouTubeVideoEditor from "@/components/YouTubeVideoEditor";
import CustomProgramImport from "@/components/CustomProgramImport";
import AIPromptTemplate from "@/components/AIPromptTemplate";
import ReminderSettings from "@/components/ReminderSettings";
import { isSoundEnabled, setSoundEnabled, playCompletionChime } from "@/utils/haptics";
import { exportCustomProgramJson } from "@/lib/customProgramJson";

export default function SettingsPage() {
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [chachaVideoResetConfirm, setChachaVideoResetConfirm] = useState(false);
  const [chachaVideoResetStatus, setChachaVideoResetStatus] = useState<string | null>(null);
  const [hasCustomProgram, setHasCustomProgram] = useState(false);
  const [customProgramName, setCustomProgramName] = useState("My Custom Program");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSettings();
    // Show the local cache immediately, then reconcile with the synced value.
    setSoundOn(isSoundEnabled());
    getCompletionSoundSetting().then((remote) => {
      if (remote !== undefined) {
        setSoundOn(remote);
        setSoundEnabled(remote); // keep local cache in sync
      }
    });

    // Check if user has a custom program
    Promise.all([getActiveProgram(), getCustomProgram(), getCustomProgramName()]).then(
      ([activeProgram, customProgram, customName]) => {
        setHasCustomProgram(
          activeProgram === "custom" && !!customProgram && customProgram.length > 0
        );
        setCustomProgramName(customName);
      }
    );
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next); // instant local cache for triggerCompletion
    setCompletionSoundSetting(next); // sync across devices
    if (next) playCompletionChime(); // preview the sound when turning it on
  };

  const handleExportProgram = async () => {
    setExporting(true);
    try {
      const program = await getCustomProgram();
      if (!program || program.length === 0) {
        alert("No custom program to export");
        return;
      }

      const json = exportCustomProgramJson(program, customProgramName);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customProgramName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export program: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setExporting(false);
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#79A98C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3E9] dark:bg-black pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-4">
        <h1 className="text-3xl font-bold text-[#1B1714] dark:text-white">Settings</h1>
        <p className="text-sm text-[#8A7F78] mt-0.5">App preferences &amp; configuration</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 space-y-3">

        {/* Completion Sound Section */}
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#1B1714] dark:text-white mb-1">🔊 Completion Sound</h2>
              <p className="text-sm text-[#8A7F78]">
                Play a little chime each time you check off an exercise. An instant audio reward — on by choice, off if it&apos;s too much.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={soundOn}
              onClick={toggleSound}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
                soundOn ? "bg-[#3E7E57]" : "bg-[#F0E9CE] dark:bg-[#3D3730]"
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
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-1">⏰ Break Reminders</h2>
          <p className="text-sm text-[#8A7F78] mb-4">
            Get nudged for each of your daily breaks. Out of sight is out of mind — these keep you on track.
          </p>
          <ReminderSettings />
        </div>

        {/* Chacha video reset */}
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-1">💪 Chacha exercise videos</h2>
          <p className="text-sm text-[#8A7F78] mb-4">
            Clears any saved video overrides so the latest built-in guides play for all 38 Chacha moves.
          </p>
          <button
            type="button"
            onClick={async () => {
              if (!chachaVideoResetConfirm) {
                setChachaVideoResetStatus(null);
                setChachaVideoResetConfirm(true);
                return;
              }
              setChachaVideoResetConfirm(false);
              setChachaVideoResetStatus(null);
              try {
                const { custom, master } = await clearChachaVideoOverrides();
                setChachaVideoResetStatus(
                  `Done — reset ${custom} custom and ${master} master video slots. Open Today to see the updated guides.`
                );
              } catch (e) {
                setChachaVideoResetStatus(e instanceof Error ? e.message : "Reset failed. Try again.");
              }
            }}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              chachaVideoResetConfirm
                ? "bg-[#E5B122] text-white"
                : "bg-[#79A98C]/10 text-[#79A98C] hover:bg-[#79A98C]/20"
            }`}
          >
            {chachaVideoResetConfirm
              ? "Tap again to confirm reset"
              : "Reset Chacha exercise videos to defaults"}
          </button>
          {chachaVideoResetStatus && (
            <p className="mt-3 text-sm text-[#8A7F78]">{chachaVideoResetStatus}</p>
          )}
        </div>

        {/* YouTube Video Section */}
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-4">
            Motivation Video
          </h2>
          <p className="text-sm text-[#8A7F78] mb-4">
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

        {/* AI Prompt Template */}
        <div id="generate-with-ai" className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-2">
            🧠 Generate with AI
          </h2>
          <p className="text-sm text-[#8A7F78] mb-4">
            Copy a prompt and paste your program into Claude or ChatGPT. It'll return perfect JSON to import below.
          </p>
          <AIPromptTemplate />
        </div>

        {/* Custom program import */}
        <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
          <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-4">
            📥 Import Custom Program
          </h2>
          <p className="text-sm text-[#8A7F78] mb-4">
            Paste the JSON you got from the AI (above), or upload a .json file directly.
          </p>
          <CustomProgramImport />
        </div>

        {/* Export Custom Program */}
        {hasCustomProgram && (
          <div className="bg-white dark:bg-[#1B1714] rounded-2xl p-5 border border-[#F0E9CE] dark:border-[#3D3730]">
            <h2 className="text-lg font-semibold text-[#1B1714] dark:text-white mb-4">
              📤 Export Custom Program
            </h2>
            <p className="text-sm text-[#8A7F78] mb-4">
              Download &quot;{customProgramName}&quot; as a JSON file. Perfect for backup or sharing with others.
            </p>
            <button
              onClick={handleExportProgram}
              disabled={exporting}
              className="w-full bg-[#3E7E57] hover:bg-[#5E8C6E] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? "Exporting..." : "⬇️ Download as JSON"}
            </button>
            <p className="text-xs text-[#8A7F78] mt-3">
              You can import this file anytime to restore or transfer your program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

