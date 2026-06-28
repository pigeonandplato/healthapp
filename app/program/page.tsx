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
      <div className="min-h-screen bg-[#F6F3E9] dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#79A98C]" />
      </div>
    );
  }

  return (
    <div className="bg-[#F6F3E9] dark:bg-black">
      <section className="bg-gradient-to-br from-[#9DC1A5] to-[#79A98C] text-white">
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
          <div className="mb-6 rounded-xl bg-[#9DC1A5]/10 dark:bg-[#9DC1A5]/8 border border-[#F0E9CE] dark:border-[#3D3730] px-4 py-3 text-sm text-[#1B1714] dark:text-white">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1B1714] dark:text-white mb-4">Choose Active Program</h2>
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

        {/* Create Custom Program */}
        <div className="mb-8 bg-gradient-to-br from-[#79A98C]/10 to-[#9DC1A5]/10 dark:from-[#79A98C]/20 dark:to-[#9DC1A5]/20 rounded-2xl p-6 border-2 border-dashed border-[#79A98C]/40 dark:border-[#79A98C]/60">
          <div className="flex items-start gap-4">
            <div className="text-3xl flex-shrink-0">🛠️</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#1B1714] dark:text-white mb-2">
                Create Custom Program
              </h3>
              <p className="text-sm text-[#8A7F78] mb-4">
                Build your own program from scratch. Describe it to Claude or ChatGPT, get JSON, import here.
              </p>
              <Link
                href="/settings#generate-with-ai"
                className="inline-block bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
              >
                Go to Generate with AI →
              </Link>
            </div>
          </div>
        </div>

        {activeProgram === "adhd" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#2C2622] rounded-2xl  p-6">
              <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white mb-4">🧠 ADHD Knee + Back Plan</h2>
              <p className="text-[#8A7F78] dark:text-[#8A7F78] mb-4">
                Three <strong>10–15 minute</strong> work-from-home breaks. Phase 1 weeks 1–4, Phase 2 weeks 5–8,
                Phase 3 week 9+. Stay on each phase ~4 weeks before changing much.
              </p>
              <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] space-y-2 list-disc pl-5 mb-4">
                <li><strong>Break 1</strong> — Back Armor (McGill curl-up, side plank, bird dog) · daily</li>
                <li><strong>Break 2</strong> — Knee strength · Mon / Wed / Fri</li>
                <li><strong>Break 3</strong> — Walk + mobility/control · daily</li>
                <li>Pain 0–3/10 okay · 4–5 reduce · 6+ or worse next day = stop/regress</li>
              </ul>
              <div className="bg-[#79A98C]/10 dark:bg-[#79A98C]/15 rounded-xl p-4 mb-4 border border-[#79A98C]/20 dark:border-[#79A98C]/30">
                <h3 className="font-semibold text-[#1B1714] dark:text-white mb-2">Diet & supplements (summary)</h3>
                <p className="text-sm text-[#79A98C] dark:text-[#8A7F78]">
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
            <div className="bg-white dark:bg-[#2C2622] rounded-2xl  p-6">
              <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white mb-4">🏋️ Gym PPL Split</h2>
              <p className="text-[#8A7F78] dark:text-[#8A7F78] mb-6">
                3 days per week: <strong>Monday, Wednesday, Friday</strong>
              </p>

              <div className="space-y-4">
                <div className="bg-[#F6F3E9] dark:bg-[#2C2622] rounded-xl p-4 border-2 border-[#F0E9CE] dark:border-[#3D3730]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💪</span>
                    <div>
                      <h3 className="font-bold text-[#1B1714] dark:text-white">Day A: Chest (Push)</h3>
                      <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">Monday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] pl-10 space-y-1">
                    <li>• Flat Chest Press & Fly (3×10)</li>
                    <li>• Decline Press & Fly (3×10)</li>
                    <li>• Incline Press & Fly (3×10)</li>
                  </ul>
                </div>

                <div className="bg-[#F6F3E9] dark:bg-[#2C2622] rounded-xl p-4 border-2 border-[#79A98C]/20 dark:border-[#79A98C]/30">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔙</span>
                    <div>
                      <h3 className="font-bold text-[#1B1714] dark:text-white">Day B: Back + Biceps (Pull)</h3>
                      <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">Wednesday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] pl-10 space-y-1">
                    <li>• Wide & Narrow Pulldown (3×10)</li>
                    <li>• Seated Row & Incline Row (3×10)</li>
                    <li>• Barbell, Dumbbell, Hammer & Mixed Curls (3×10)</li>
                  </ul>
                </div>

                <div className="bg-[#F6F3E9] dark:bg-[#2C2622] rounded-xl p-4 border-2 border-[#F0E9CE] dark:border-[#3D3730]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🦵</span>
                    <div>
                      <h3 className="font-bold text-[#1B1714] dark:text-white">Day C: Shoulders + Legs</h3>
                      <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">Friday</p>
                    </div>
                  </div>
                  <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] pl-10 space-y-1">
                    <li>• DB & BB Overhead Press, Shrugs, Shoulder Fly (3×10-12)</li>
                    <li>• Squats, Walking Lunges, Step Up (3×12)</li>
                    <li>• Leg Extension & Leg Press (3×12)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#F0E9CE] dark:bg-[#3D3730] rounded-2xl p-6 border-2 border-[#F0E9CE] dark:border-[#4A433E]">
              <h3 className="font-bold text-[#1B1714] dark:text-white mb-3">💡 Training Tips</h3>
              <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] space-y-2">
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
            <div className="bg-white dark:bg-[#2C2622] rounded-2xl  p-6">
              <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white mb-4">💪 Chacha Training</h2>
              <p className="text-[#8A7F78] dark:text-[#8A7F78] mb-6">
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
                    className="bg-gradient-to-r from-[#79A98C]/5 to-[#9DC1A5]/5 dark:from-[#79A98C]/10 dark:to-[#9DC1A5]/10 rounded-xl p-4 border border-[#79A98C]/20 dark:border-[#79A98C]/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{d.emoji}</span>
                      <div>
                        <h3 className="font-bold text-[#1B1714] dark:text-white">{d.day}</h3>
                        <p className="text-sm text-[#8A7F78] dark:text-[#8A7F78]">{d.focus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F0E9CE] dark:bg-[#3D3730] rounded-2xl p-6 border-2 border-[#F0E9CE] dark:border-[#4A433E]">
              <h3 className="font-bold text-[#1B1714] dark:text-white mb-3">💡 Training Tips</h3>
              <ul className="text-sm text-[#3D3730] dark:text-[#D4CFC9] space-y-2">
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
            <div className="bg-white dark:bg-[#2C2622] rounded-2xl  p-6">
              <h2 className="text-2xl font-bold text-[#1B1714] dark:text-white mb-4">🗂️ {customName}</h2>
              <p className="text-[#8A7F78] dark:text-[#8A7F78] mb-4">
                Your imported program. Workouts run on <strong>Monday (A)</strong>, <strong>Wednesday (B)</strong> and{" "}
                <strong>Friday (C)</strong>, advancing one week at a time. Weeks loop at the final week so you always have something to do.
              </p>
              <div className="bg-[#79A98C]/10 dark:bg-[#79A98C]/15 rounded-xl p-4 mb-4 border border-[#79A98C]/20 dark:border-[#79A98C]/30 text-sm text-[#79A98C] dark:text-[#9DC1A5]">
                Want to edit it? Re-import updated JSON from <strong>Settings → Import Custom Program</strong>. The new file replaces this one.
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
