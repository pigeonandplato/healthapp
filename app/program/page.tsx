"use client";

import { useState, useEffect } from "react";
import type { ProgramType } from "@/lib/types";
import {
  getActiveProgram,
  setActiveProgram,
  AVAILABLE_PROGRAMS,
  setAdhdProgramStartDate,
  getTodayDateString,
} from "@/lib/db";

export default function ProgramPage() {
  const [loading, setLoading] = useState(true);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("adhd");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const currentProgram = await getActiveProgram();
      setActiveProgramState(currentProgram);
      setLoading(false);
    }
    load();
  }, []);

  const handleProgramSwitch = async (programType: ProgramType) => {
    setActiveProgramState(programType);
    await setActiveProgram(programType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <section className="bg-gradient-to-br from-[#FF2D55] via-[#FF6482] to-[#FF9500] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-2">Your Programs 🎯</h2>
          <p className="text-white/90 text-sm">Select which program to track today</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Active Program</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeProgram === "adhd" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">🧠 ADHD Knee + Back Plan</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Three <strong>10–15 minute</strong> work-from-home breaks. Phase 1 weeks 1–4, Phase 2 weeks 5–8,
                Phase 3 week 9+. Stay on each phase ~4 weeks before changing much.
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5 mb-4">
                <li><strong>Break 1</strong> — Back Armor (McGill curl-up, side plank, bird dog) · daily</li>
                <li><strong>Break 2</strong> — Knee strength · Mon / Wed / Fri</li>
                <li><strong>Break 3</strong> — Walk + mobility/control · daily</li>
                <li>Pain 0–3/10 okay · 4–5 reduce · 6+ or worse next day = stop/regress</li>
              </ul>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Diet & supplements (summary)</h3>
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  Protein ~105–140 g/day at ~195 lb · protein-first meals · consider whey, creatine 3–5 g/day,
                  omega-3, curcumin, vitamin D if appropriate — check with your clinician.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await setAdhdProgramStartDate(getTodayDateString());
                  window.location.reload();
                }}
                className="w-full sm:w-auto bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 px-5 rounded-xl transition"
              >
                Set program start to today (week 1)
              </button>
            </div>
          </div>
        )}

        {activeProgram === "gym" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">🏋️ Gym PPL Split</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                3 days per week: <strong>Monday, Wednesday, Friday</strong>
              </p>

              <div className="space-y-4">
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
      </main>
    </div>
  );
}
