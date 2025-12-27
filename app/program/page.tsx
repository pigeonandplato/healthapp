"use client";

import { useState, useEffect } from "react";
import { getProgramMetaForDate, PROGRAM_PHASES, setProgramStartDate } from "@/lib/program";
import type { ProgramMeta } from "@/lib/types";
import Link from "next/link";

export default function ProgramPage() {
  const [program, setProgram] = useState<ProgramMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const meta = await getProgramMetaForDate();
      setProgram(meta);
      setLoading(false);
    }
    load();
  }, []);

  const handleReset = async () => {
    const today = new Date().toISOString().split("T")[0];
    await setProgramStartDate(today);
    window.location.reload();
  };

  const handleAdjustProgram = async (days: number) => {
    if (!program) return;
    const startDate = new Date(program.startDate);
    startDate.setDate(startDate.getDate() - days); // Subtract days to push program forward
    const newStartDate = startDate.toISOString().split("T")[0];
    await setProgramStartDate(newStartDate);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  const currentPhase = PROGRAM_PHASES.find((p) => p.phase === program?.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <header className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/today"
              className="text-white/80 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Today
            </Link>
            <button
              onClick={() => setShowReset(!showReset)}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition"
            >
              Settings
            </button>
          </div>
          <h1 className="text-4xl font-black mb-2">Your 5K Program 🎯</h1>
          <p className="text-blue-100">24-week journey to running a safe 5K</p>
          <Link
            href="/schedule"
            className="inline-block mt-2 text-sm text-blue-100 hover:text-white underline"
          >
            📅 View Day-by-Day Schedule
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">📍 Current Status</h2>
            <button
              onClick={() => setShowAdjust(!showAdjust)}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              ⚙️ Adjust Program
            </button>
          </div>

          {/* Program Adjustment Panel */}
          {showAdjust && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Adjust Program Timeline</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Missed a day? Push your entire program forward. Want to catch up? Pull it back.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleAdjustProgram(-7)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏮️ Back 1 Week
                </button>
                <button
                  onClick={() => handleAdjustProgram(-3)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏮️ Back 3 Days
                </button>
                <button
                  onClick={() => handleAdjustProgram(-1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏮️ Back 1 Day
                </button>
                <button
                  onClick={() => handleAdjustProgram(1)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏭️ Forward 1 Day
                </button>
                <button
                  onClick={() => handleAdjustProgram(3)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏭️ Forward 3 Days
                </button>
                <button
                  onClick={() => handleAdjustProgram(7)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⏭️ Forward 1 Week
                </button>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Example:</strong> If you miss today's workout, click "Forward 1 Day" to push your entire program by 1 day. Tomorrow will show today's workout.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">Week {program?.week}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">of 24</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-600">{program?.phase}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{currentPhase?.title.split("(")[0]}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-600">Day {program?.day}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">A/B/C Rotation</div>
            </div>
          </div>
          {currentPhase && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">{currentPhase.title}</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div><strong>Running:</strong> {currentPhase.running}</div>
                <div><strong>Week:</strong> {currentPhase.startWeek}–{currentPhase.endWeek}</div>
              </div>
            </div>
          )}
        </div>

        {/* All Phases */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">📈 Program Phases</h2>
          {PROGRAM_PHASES.map((phase) => {
            const isCurrent = phase.phase === program?.phase;
            const isPast = program && phase.endWeek < program.week;
            return (
              <div
                key={phase.phase}
                className={`rounded-xl p-6 border-2 ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-500"
                    : isPast
                    ? "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {phase.phase}: {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weeks {phase.startWeek}–{phase.endWeek} • Running: {phase.running}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Current
                    </span>
                  )}
                  {isPast && (
                    <span className="bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Focus:</div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                      {phase.focus.map((f, i) => (
                        <li key={i} className="list-disc">{f}</li>
                      ))}
                    </ul>
                  </div>
                  {phase.gate.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Gates to next phase:
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                        {phase.gate.map((g, i) => (
                          <li key={i} className="list-disc">{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Section */}
        {showReset && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-xl p-6">
            <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">⚠️ Reset Program</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              This will restart your program from Week 1 as of today. Your workout history remains.
            </p>
            <button
              onClick={handleReset}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Reset to Week 1
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/today"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition"
          >
            Back to Today's Workout →
          </Link>
        </div>
      </main>
    </div>
  );
}

