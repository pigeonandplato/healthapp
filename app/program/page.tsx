"use client";

import { useState, useEffect } from "react";
import { getProgramMetaForDate, PROGRAM_PHASES, setProgramStartDate } from "@/lib/program";
import type { ProgramMeta, ProgramType } from "@/lib/types";
import { getActiveProgram, setActiveProgram, AVAILABLE_PROGRAMS } from "@/lib/db";

export default function ProgramPage() {
  const [program, setProgram] = useState<ProgramMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("running");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const currentProgram = await getActiveProgram();
      setActiveProgramState(currentProgram);
      const meta = await getProgramMetaForDate();
      setProgram(meta);
      setLoading(false);
    }
    load();
  }, []);

  const handleProgramSwitch = async (programType: ProgramType) => {
    setActiveProgramState(programType);
    await setActiveProgram(programType);
  };

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
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF2D55] via-[#FF6482] to-[#FF9500] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Your Programs 🎯</h2>
            {activeProgram === "running" && (
              <button
                onClick={() => setShowReset(!showReset)}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition font-medium"
              >
                ⚙️ Settings
              </button>
            )}
          </div>
          <p className="text-white/90 text-sm">Select which program to track today</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Program Selector Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Active Program</h2>
          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => handleProgramSwitch(prog.type)}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  prog.type === activeProgram
                    ? "border-[#FF2D55] bg-[#FF2D55]/10 dark:bg-[#FF2D55]/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="text-3xl mb-2">{prog.icon}</div>
                <div className="font-bold text-gray-900 dark:text-white">{prog.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{prog.description}</div>
                {prog.type === activeProgram && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FF2D55]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Running Program Content */}
        {activeProgram === "running" && (
          <>
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
          </>
        )}

        {/* Gym Program Content */}
        {activeProgram === "gym" && (
          <div className="space-y-6">
            {/* Gym Program Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">🏋️ Gym PPL Split</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                3 days per week: <strong>Monday, Wednesday, Friday</strong>
              </p>
              
              <div className="space-y-4">
                {/* Day A */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💪</span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Day A: Chest (Push)</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 pl-10 space-y-1">
                    <li>• Flat Chest Press & Fly (3×10)</li>
                    <li>• Decline Press & Fly (3×10)</li>
                    <li>• Incline Press & Fly (3×10)</li>
                  </ul>
                </div>

                {/* Day B */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔙</span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Day B: Back + Biceps (Pull)</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Wednesday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 pl-10 space-y-1">
                    <li>• Wide & Narrow Pulldown (3×10)</li>
                    <li>• Seated Row & Incline Row (3×10)</li>
                    <li>• Barbell, Dumbbell, Hammer & Mixed Curls (3×10)</li>
                  </ul>
                </div>

                {/* Day C */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🦵</span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Day C: Shoulders + Legs</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Friday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 pl-10 space-y-1">
                    <li>• DB & BB Overhead Press, Shrugs, Shoulder Fly (3×10-12)</li>
                    <li>• Squats, Walking Lunges, Step Up (3×12)</li>
                    <li>• Leg Extension & Leg Press (3×12)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-3">💡 Training Tips</h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                <li>• <strong>Rest Days:</strong> Tue, Thu, Sat, Sun - use for recovery or light cardio</li>
                <li>• <strong>Progression:</strong> Increase weight when 3×10/12 feels comfortable</li>
                <li>• <strong>Rest Between Sets:</strong> 60-90 seconds</li>
                <li>• <strong>Form First:</strong> Control the weight, full range of motion</li>
              </ul>
            </div>
          </div>
        )}

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

      </main>
    </div>
  );
}

