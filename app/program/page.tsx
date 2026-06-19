"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ProgramType, ProgramInfo } from "@/lib/types";
import {
  getActiveProgram,
  setActiveProgram,
  getAvailablePrograms,
  getArchivedPrograms,
  archiveProgram,
  getAdhdProgramStartDate,
  setAdhdProgramStartDate,
  getGymProgramStartDate,
  setGymProgramStartDate,
  getChachaProgramStartDate,
  setChachaProgramStartDate,
  getCustomProgramStartDate,
  setCustomProgramStartDate,
  getCustomProgramName,
} from "@/lib/db";
import ProgramStartDateControl from "@/components/ProgramStartDateControl";
import ProgramListCard from "@/components/ProgramListCard";

export default function ProgramPage() {
  const [loading, setLoading] = useState(true);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("adhd");
  const [programs, setPrograms] = useState<ProgramInfo[]>([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [customName, setCustomName] = useState("My Custom Program");
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = async () => {
    const [currentProgram, available, archived, cName] = await Promise.all([
      getActiveProgram(),
      getAvailablePrograms(),
      getArchivedPrograms(),
      getCustomProgramName(),
    ]);
    setActiveProgramState(currentProgram);
    setPrograms(available);
    setArchivedCount(archived.length);
    setCustomName(cName);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      await loadPrograms();
      setLoading(false);
    }
    load();
  }, []);

  const handleProgramSwitch = async (programType: ProgramType) => {
    setActiveProgramState(programType);
    await setActiveProgram(programType);
  };

  const handleArchive = async (program: ProgramInfo) => {
    setError(null);
    const confirmed = window.confirm(
      `Archive "${program.name}"?\n\nIt will move off this screen. You can restore it anytime from Archived Programs.`
    );
    if (!confirmed) return;

    const result = await archiveProgram(program.type);
    if (!result.ok) {
      setError(result.error ?? "Could not archive that program.");
      return;
    }

    await loadPrograms();
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
          <Link
            href="/program/archived"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-white/90 hover:text-white underline-offset-2 hover:underline"
          >
            {archivedCount > 0
              ? `View archived programs (${archivedCount}) →`
              : "View archived programs →"}
          </Link>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Active Program</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <ProgramListCard
                key={prog.id}
                program={prog}
                isActive={prog.type === activeProgram}
                onSelect={() => handleProgramSwitch(prog.type)}
                action={{
                  label: "Archive",
                  variant: "archive",
                  onClick: () => handleArchive(prog),
                }}
              />
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
              <ProgramStartDateControl
                title="When did you start this plan?"
                description="Pick the date you began (or plan to begin). Week numbers and phases count forward from here."
                getStartDate={getAdhdProgramStartDate}
                setStartDate={setAdhdProgramStartDate}
              />
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
              <ProgramStartDateControl
                title="When did you start gym training?"
                getStartDate={getGymProgramStartDate}
                setStartDate={setGymProgramStartDate}
              />
            </div>
          </div>
        )}

        {activeProgram === "chacha" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">💪 Chacha Training</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                5 days per week: <strong>Monday through Friday</strong>. Knee/back-friendly exercises with video guides and TL;DR cues for every move.
              </p>

              <div className="space-y-3">
                {[
                  { emoji: "🦵", day: "Monday", focus: "Legs — mobility, box squat, RDL, leg press, band walks, calves" },
                  { emoji: "❤️", day: "Tuesday", focus: "Cardio / Grip / Core — elliptical, carries, hangs, McGill-style core" },
                  { emoji: "💪", day: "Wednesday", focus: "Chest — push-ups, presses, flies, optional dips" },
                  { emoji: "🔙", day: "Thursday", focus: "Back — pulldowns, supported rows, hip thrust, shrugs" },
                  { emoji: "🏋️", day: "Friday", focus: "Arms & Shoulders — biceps, delts, triceps" },
                ].map((d) => (
                  <div
                    key={d.day}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{d.emoji}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{d.day}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{d.focus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-3">💡 Training Tips</h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                <li>• <strong>Rest Days:</strong> Saturday & Sunday — recovery or light walking</li>
                <li>• <strong>Safety rule:</strong> 0–3/10 discomfort = okay · 4–5/10 = reduce load/range · 6+/10 or worse next day = stop</li>
                <li>• <strong>Every exercise</strong> has step-by-step form cues, common mistakes, and stop conditions on its card</li>
                <li>• <strong>Form first:</strong> Watch the embedded video on each exercise before loading up</li>
                <li>• <strong>Wrist tip:</strong> Use neutral grips, push-up handles, or elevate hands if wrists complain</li>
                <li>• <strong>Progression:</strong> Add weight/reps only when form stays clean</li>
              </ul>
              <ProgramStartDateControl
                title="When did you start Chacha Training?"
                getStartDate={getChachaProgramStartDate}
                setStartDate={setChachaProgramStartDate}
              />
            </div>
          </div>
        )}

        {activeProgram === "custom" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">🗂️ {customName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your imported program. Workouts run on <strong>Monday (A)</strong>, <strong>Wednesday (B)</strong> and{" "}
                <strong>Friday (C)</strong>, advancing one week at a time. Weeks loop at the final week so you always have something to do.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                Want to edit it? Re-import an updated CSV from <strong>Settings → Import Custom Program</strong>. The new file replaces this one.
              </div>
              <ProgramStartDateControl
                title="When did you start this program?"
                getStartDate={getCustomProgramStartDate}
                setStartDate={setCustomProgramStartDate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
