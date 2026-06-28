"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { WorkoutDay, Exercise, ExerciseBlock } from "@/lib/types";
import { getCompletionsByDate, saveCompletion } from "@/lib/db";
import { triggerCompletion, triggerHaptic } from "@/utils/haptics";
import Break2RestCard, { workoutHasBreak2 } from "./Break2RestCard";

// Short beep so the timer works as a hands-free body-double signal.
function playBeep() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    osc.onended = () => ctx.close();
  } catch {
    // Audio not available — haptics still fire.
  }
}

// Seconds a single set/hold/walk should run, or null if it isn't time-based.
function timerSecondsFor(ex: Exercise): number | null {
  const p = ex.prescription;
  if (p.holdSeconds) return p.holdSeconds;
  if (p.minutes) return p.minutes * 60;
  return null;
}

interface FocusViewProps {
  workout: WorkoutDay;
  onProgressChange?: (completed: number, total: number) => void;
}

type Mission = {
  block: ExerciseBlock;
  exercises: Exercise[];
};

function getMissions(workout: WorkoutDay): Mission[] {
  return workout.blocks
    .map((block) => ({
      block,
      exercises: block.exercises.filter((ex) => ex.category !== "Guidance"),
    }))
    .filter((m) => m.exercises.length > 0);
}

function getMinimumChecklist(workout: WorkoutDay): string[] {
  for (const block of workout.blocks) {
    const min = block.exercises.find((ex) => ex.id.startsWith("adhd-minimum"));
    if (min) return min.instructions;
  }
  return [];
}

function formatPrescription(ex: Exercise): string {
  const p = ex.prescription;
  if (p.description) return p.description;
  const parts: string[] = [];
  if (p.sets) parts.push(`${p.sets} sets`);
  if (p.reps) parts.push(`${p.reps} reps`);
  if (p.holdSeconds) parts.push(`${p.holdSeconds}s hold`);
  if (p.minutes) parts.push(`${p.minutes} min`);
  return parts.join(" · ");
}

export default function FocusView({ workout, onProgressChange }: FocusViewProps) {
  const missions = useMemo(() => getMissions(workout), [workout]);
  const minimumChecklist = useMemo(() => getMinimumChecklist(workout), [workout]);

  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [activeMissionIdx, setActiveMissionIdx] = useState<number | null>(null);
  const [showMinimum, setShowMinimum] = useState(false);
  const [celebrateAll, setCelebrateAll] = useState(false);

  const allExerciseIds = useMemo(
    () => missions.flatMap((m) => m.exercises.map((e) => e.id)),
    [missions]
  );

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const all = await getCompletionsByDate(workout.date);
      if (!active) return;
      const map: Record<string, boolean> = {};
      all.forEach((c) => (map[c.exerciseId] = c.completed));
      setCompletions(map);
      setLoading(false);
      const completed = allExerciseIds.filter((id) => map[id]).length;
      onProgressChange?.(completed, allExerciseIds.length);
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.date]);

  const persist = async (next: Record<string, boolean>, changedId: string, value: boolean) => {
    setCompletions(next);
    if (value) triggerCompletion();
    await saveCompletion(changedId, workout.date, value);
    const completed = allExerciseIds.filter((id) => next[id]).length;
    onProgressChange?.(completed, allExerciseIds.length);
  };

  const setExerciseDone = async (id: string, value: boolean) => {
    const next = { ...completions, [id]: value };
    await persist(next, id, value);
  };

  const completeMission = async (mission: Mission) => {
    const next = { ...completions };
    const toSave: string[] = [];
    mission.exercises.forEach((ex) => {
      if (!next[ex.id]) {
        next[ex.id] = true;
        toSave.push(ex.id);
      }
    });
    setCompletions(next);
    if (toSave.length) triggerCompletion();
    await Promise.all(toSave.map((id) => saveCompletion(id, workout.date, true)));
    const completed = allExerciseIds.filter((id) => next[id]).length;
    onProgressChange?.(completed, allExerciseIds.length);
  };

  const doMinimum = async () => {
    // Easy win: complete the first exercise of each break so the day still counts.
    const next = { ...completions };
    const toSave: string[] = [];
    missions.forEach((m) => {
      const first = m.exercises[0];
      if (first && !next[first.id]) {
        next[first.id] = true;
        toSave.push(first.id);
      }
    });
    setCompletions(next);
    triggerCompletion();
    await Promise.all(toSave.map((id) => saveCompletion(id, workout.date, true)));
    const completed = allExerciseIds.filter((id) => next[id]).length;
    onProgressChange?.(completed, allExerciseIds.length);
    setShowMinimum(false);
  };

  const missionProgress = (m: Mission) => {
    const done = m.exercises.filter((e) => completions[e.id]).length;
    return { done, total: m.exercises.length, complete: done === m.exercises.length };
  };

  const completedMissions = missions.filter((m) => missionProgress(m).complete).length;
  const totalDone = allExerciseIds.filter((id) => completions[id]).length;
  const allComplete = missions.length > 0 && completedMissions === missions.length;

  // Break 2 (knee strength) is Mon / Wed / Fri only — on other days it's intentionally omitted.
  const hasBreak2Today = workoutHasBreak2(missions.map((m) => m.block));

  const isBreak1Mission = (m: Mission) =>
    m.block.id.includes("break1") || m.block.name.includes("Break 1");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-[#EDE8DC] dark:bg-[#2C2C2E] rounded-3xl animate-pulse" />
        <div className="h-28 bg-[#EDE8DC] dark:bg-[#2C2C2E] rounded-3xl animate-pulse" />
        <div className="h-28 bg-[#EDE8DC] dark:bg-[#2C2C2E] rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Daily Wins hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9DBFD0] to-[#4A8FA8] text-white p-6 shadow-elevated">
        <div className="flex items-center gap-5">
          <DailyRing completed={completedMissions} total={missions.length} />
          <div className="flex-1">
            <h2 className="text-2xl font-black leading-tight">
              {allComplete ? "Day complete! 🎉" : completedMissions === 0 ? "Let's get an easy win" : "Keep it rolling"}
            </h2>
            <p className="text-white/90 text-sm mt-1">
              {allComplete
                ? "Every break done. That's a real win."
                : !hasBreak2Today
                  ? `${completedMissions} of ${missions.length} breaks done · knee block rests today (Mon/Wed/Fri)`
                  : `${completedMissions} of ${missions.length} breaks done · ${totalDone} moves logged`}
            </p>
          </div>
        </div>
        {!allComplete && (
          <button
            onClick={() => setShowMinimum(true)}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
          >
            😮‍💨 Overwhelmed? Do the 2-minute minimum
          </button>
        )}
      </div>

      {/* Break mission cards */}
      <div className="space-y-3">
        {missions.flatMap((m, idx) => {
          const { done, total, complete } = missionProgress(m);
          const started = done > 0 && !complete;
          const cards = [
            <div
              key={m.block.id}
              className={`rounded-3xl border-2 p-5 shadow-card transition-all ${
                complete
                  ? "border-[#3F6B40]/40 bg-[#3F6B40]/5"
                  : "border-[#EDE8DC] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white leading-snug">
                    {m.block.name}
                  </h3>
                  {m.block.description && (
                    <p className="text-xs text-[#8E8E93] mt-0.5">{m.block.description}</p>
                  )}
                </div>
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
                    complete
                      ? "bg-[#3F6B40] text-white"
                      : "bg-[#EDE8DC] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white"
                  }`}
                >
                  {complete ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    `${done}/${total}`
                  )}
                </div>
              </div>

              <div className="w-full bg-[#EDE8DC] dark:bg-[#38383A] rounded-full h-2 overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-[#3F6B40]" : "bg-[#4A8FA8]"}`}
                  style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMissionIdx(idx)}
                  className={`flex-1 font-semibold py-3 rounded-xl transition-all active:scale-[0.98] ${
                    complete
                      ? "bg-[#EDE8DC] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white"
                      : "bg-[#4A8FA8] hover:bg-[#38788F] text-white"
                  }`}
                >
                  {complete ? "Review" : started ? "Continue →" : "Start →"}
                </button>
                {!complete && (
                  <button
                    onClick={() => completeMission(m)}
                    className="px-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all text-sm"
                    title="Mark this whole break done"
                  >
                    ✓ All
                  </button>
                )}
              </div>
            </div>,
          ];

          if (isBreak1Mission(m) && !hasBreak2Today) {
            cards.push(<Break2RestCard key="break2-rest" />);
          }

          return cards;
        })}
      </div>

      {/* Focus session overlay */}
      {activeMissionIdx !== null && missions[activeMissionIdx] && (
        <FocusSession
          mission={missions[activeMissionIdx]}
          completions={completions}
          onToggle={setExerciseDone}
          onClose={() => setActiveMissionIdx(null)}
          onMissionComplete={() => {
            const stillIncomplete = missions.some((mm, i) => i !== activeMissionIdx && !missionProgress(mm).complete);
            if (!stillIncomplete) setCelebrateAll(true);
          }}
        />
      )}

      {/* Minimum-day modal */}
      {showMinimum && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMinimum(false)}>
          <div
            className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 max-w-md w-full  animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">🫶</div>
              <h3 className="text-xl font-bold text-[#1C1C1E] dark:text-white">The 2-minute minimum</h3>
              <p className="text-sm text-[#8E8E93] mt-1">
                Low-energy day? Doing this still counts and keeps your streak alive. Never miss twice.
              </p>
            </div>
            {minimumChecklist.length > 0 && (
              <ul className="space-y-2 mb-5 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl p-4">
                {minimumChecklist.map((line, i) => (
                  <li key={i} className="text-sm text-[#1C1C1E] dark:text-white flex gap-2">
                    <span className="text-[#4A8FA8]">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={doMinimum}
              className="w-full bg-[#3F6B40] hover:brightness-95 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              I did the minimum — count my win ✓
            </button>
            <button
              onClick={() => setShowMinimum(false)}
              className="w-full mt-2 text-[#8E8E93] font-medium py-2 text-sm"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* All-complete celebration */}
      {celebrateAll && <Celebration onClose={() => setCelebrateAll(false)} />}
    </div>
  );
}

function DailyRing({ completed, total }: { completed: number; total: number }) {
  const size = 76;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? completed / total : 0;
  const offset = circumference - pct * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.3)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-black text-white">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}

interface FocusSessionProps {
  mission: Mission;
  completions: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => Promise<void>;
  onClose: () => void;
  onMissionComplete: () => void;
}

function FocusSession({ mission, completions, onToggle, onClose, onMissionComplete }: FocusSessionProps) {
  // Start at first not-yet-done exercise.
  const firstUndone = mission.exercises.findIndex((e) => !completions[e.id]);
  const [idx, setIdx] = useState(firstUndone === -1 ? 0 : firstUndone);
  const [celebrate, setCelebrate] = useState(false);
  const [showHow, setShowHow] = useState(false);

  const exercise = mission.exercises[idx];
  const total = mission.exercises.length;
  const localDone = mission.exercises.filter((e) => completions[e.id]).length;

  const advance = () => {
    const nextUndone = mission.exercises.findIndex((e, i) => i > idx && !completions[e.id]);
    if (nextUndone !== -1) {
      setIdx(nextUndone);
      setShowHow(false);
    } else if (idx < total - 1) {
      setIdx(idx + 1);
      setShowHow(false);
    }
  };

  const handleDone = async () => {
    await onToggle(exercise.id, true);
    const willBeDone = mission.exercises.every((e) => (e.id === exercise.id ? true : completions[e.id]));
    if (willBeDone) {
      setCelebrate(true);
      onMissionComplete();
    } else {
      advance();
    }
  };

  const videoUrl = exercise.media.type === "video" ? exercise.media.videoUrl : null;
  const timerSeconds = timerSecondsFor(exercise);

  if (celebrate) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1C1C1E] p-6">
        <Celebration inline title={`${mission.block.name.replace(/\(.*\)/, "").trim()} done!`} subtitle="Nice. That's a win banked." onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
        <button onClick={onClose} className="text-[#8E8E93] font-medium text-sm flex items-center gap-1" aria-label="Close focus session">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
        <span className="text-sm font-semibold text-[#1C1C1E] dark:text-white truncate max-w-[55%]">
          {mission.block.name.replace(/\(.*\)/, "").trim()}
        </span>
        <span className="text-sm font-bold text-[#3F6B40]">{localDone}/{total}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 px-4 py-3">
        {mission.exercises.map((e, i) => (
          <button
            key={e.id}
            onClick={() => { setIdx(i); setShowHow(false); }}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              completions[e.id]
                ? "bg-[#3F6B40]"
                : i === idx
                  ? "bg-[#4A8FA8]"
                  : "bg-[#EDE8DC] dark:bg-[#38383A]"
            }`}
            aria-label={`Go to exercise ${i + 1}`}
          />
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {videoUrl && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-4">
            <iframe
              src={videoUrl}
              title={exercise.media.alt}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <h2 className="text-3xl font-black text-[#1C1C1E] dark:text-white mb-2">{exercise.name}</h2>
        <div className="inline-block text-sm font-bold text-[#4A8FA8] bg-[#4A8FA8]/10 px-3 py-1.5 rounded-full mb-4">
          {formatPrescription(exercise)}
        </div>

        {timerSeconds !== null && (
          <HoldTimer
            key={exercise.id}
            seconds={timerSeconds}
            label={exercise.prescription.minutes ? "Walk" : "Hold"}
          />
        )}

        {exercise.instructions.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowHow((s) => !s)}
              className="flex items-center gap-2 text-[#4A8FA8] font-semibold text-sm mb-2"
            >
              {showHow ? "Hide how-to" : "How to do it"}
              <svg className={`w-4 h-4 transition-transform ${showHow ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showHow && (
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#3A3A3C] dark:text-[#D1D1D6]">
                {exercise.instructions.map((ins, i) => (
                  <li key={i} className="leading-relaxed">{ins}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {exercise.stopConditions.length > 0 && (
          <div className="bg-[#9DBFD0]/10 dark:bg-[#9DBFD0]/8 rounded-2xl p-3 text-xs text-[#8E8E93] dark:text-[#D1D1D6]">
            🛑 Stop if: {exercise.stopConditions.join(" · ")}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-[#E5E5EA] dark:border-[#38383A] space-y-2 bg-white dark:bg-black">
        {completions[exercise.id] ? (
          <button
            onClick={advance}
            className="w-full bg-[#3F6B40] text-white font-bold py-4 rounded-2xl text-lg active:scale-[0.98] transition-all"
          >
            ✓ Done — next
          </button>
        ) : (
          <button
            onClick={handleDone}
            className="w-full bg-[#4A8FA8] hover:bg-[#38788F] text-white font-bold py-4 rounded-2xl text-lg active:scale-[0.98] transition-all"
          >
            Mark done ✓
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => { if (idx > 0) { setIdx(idx - 1); setShowHow(false); } }}
            disabled={idx === 0}
            className="flex-1 text-[#8E8E93] font-medium py-2 text-sm disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            onClick={advance}
            disabled={idx >= total - 1}
            className="flex-1 text-[#8E8E93] font-medium py-2 text-sm disabled:opacity-40"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}

function HoldTimer({ seconds, label }: { seconds: number; label: string }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setFinished(true);
          triggerHaptic("heavy");
          playBeep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(seconds);
    setRunning(false);
    setFinished(false);
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}`;
  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 0;

  return (
    <div className="bg-[#EDE8DC] dark:bg-[#1C1C1E] rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide">
          {finished ? "Time's up! 🎉" : `${label} timer`}
        </span>
        <span className={`text-3xl font-black tabular-nums ${finished ? "text-[#3F6B40]" : "text-[#1C1C1E] dark:text-white"}`}>
          {display}
        </span>
      </div>
      <div className="w-full bg-white/60 dark:bg-[#38383A] rounded-full h-2 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${finished ? "bg-[#3F6B40]" : "bg-[#4A8FA8]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2">
        {!finished ? (
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex-1 bg-[#4A8FA8] hover:brightness-95 text-white font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] text-sm"
          >
            {running ? "⏸ Pause" : remaining === seconds ? "▶ Start timer" : "▶ Resume"}
          </button>
        ) : (
          <div className="flex-1 text-center text-sm font-semibold text-[#3F6B40] py-2.5">Hold complete</div>
        )}
        <button
          onClick={reset}
          className="px-4 bg-[#E5E5EA] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-medium py-2.5 rounded-xl transition-all text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Celebration({
  onClose,
  inline = false,
  title = "Boom! 🎉",
  subtitle = "That's another win in the bank.",
}: {
  onClose: () => void;
  inline?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const content = (
    <div className="relative bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 max-w-sm w-full  text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              backgroundColor: ["#9DBFD0", "#4A8FA8", "#3F6B40", "#9DBFD0", "#38788F"][i % 5],
              animationDelay: `${Math.random() * 0.4}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">
        <div className="text-7xl mb-3 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-[#1C1C1E] dark:text-white mb-1">{title}</h2>
        <p className="text-[#8E8E93] mb-6">{subtitle}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#4A8FA8] hover:bg-[#38788F] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
        >
          Let&apos;s go 💪
        </button>
      </div>
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(540deg); opacity: 0; }
        }
        .animate-confetti-fall { animation: confetti-fall 1.4s ease-in forwards; }
      `}</style>
    </div>
  );

  if (inline) return content;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {content}
    </div>
  );
}
