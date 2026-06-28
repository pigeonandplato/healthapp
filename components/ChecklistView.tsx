"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkoutDay, Exercise } from "@/lib/types";
import { getCompletionsByDate, saveCompletion } from "@/lib/db";
import { triggerCompletion } from "@/utils/haptics";
import { WorkoutSkeleton } from "./SkeletonLoader";

interface ChecklistViewProps {
  workout: WorkoutDay;
  onProgressChange?: (completed: number, total: number) => void;
  onOpenDetailView?: () => void;
}

function formatPrescription(exercise: Exercise): string {
  const p = exercise.prescription;
  if (p.description) return p.description;
  const parts: string[] = [];
  if (p.sets) parts.push(`${p.sets}×`);
  if (p.reps) parts.push(`${p.reps}`);
  if (p.holdSeconds) parts.push(`${p.holdSeconds}s hold`);
  if (p.minutes) parts.push(`${p.minutes} min`);
  return parts.join(" ");
}

function ExerciseDetailPreview({ exercise, onOpenDetailView }: { exercise: Exercise; onOpenDetailView?: () => void }) {
  return (
    <div className="pt-3 pb-1 space-y-3 text-sm">
      {exercise.description && (
        <p className="text-[#3D3730] dark:text-[#D4CFC9] leading-relaxed">{exercise.description}</p>
      )}
      {exercise.instructions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#8A7F78] uppercase tracking-wide mb-2">How to do it</p>
          <ol className="space-y-1.5">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-[#3D3730] dark:text-[#D4CFC9]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F0E9CE] dark:bg-[#2C2622] text-[#8A7F78] text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {exercise.commonMistakes.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#79A98C] uppercase tracking-wide mb-2">Watch out for</p>
          <ul className="space-y-1">
            {exercise.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-[#3D3730] dark:text-[#D4CFC9]">
                <span className="text-[#79A98C] flex-shrink-0 mt-0.5">·</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {exercise.stopConditions.length > 0 && (
        <div className="bg-[#9DC1A5]/10 border border-[#9DC1A5]/30 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-[#9DC1A5] uppercase tracking-wide mb-1.5">Stop if</p>
          <ul className="space-y-1">
            {exercise.stopConditions.map((s, i) => (
              <li key={i} className="text-sm text-[#3D3730] dark:text-[#D4CFC9] flex gap-2">
                <span className="text-[#9DC1A5] flex-shrink-0">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {onOpenDetailView && exercise.media.type === "video" && (
        <button
          type="button"
          onClick={onOpenDetailView}
          className="text-xs font-semibold text-[#79A98C] flex items-center gap-1"
        >
          Watch video guide
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function ChecklistView({ workout, onProgressChange, onOpenDetailView }: ChecklistViewProps) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const trackableExercises = workout.blocks
    .flatMap((b) => b.exercises)
    .filter((ex) => ex.category !== "Guidance");

  useEffect(() => {
    let active = true;
    async function loadCompletions() {
      setLoading(true);
      const allCompletions = await getCompletionsByDate(workout.date);
      if (!active) return;
      const completionMap: Record<string, boolean> = {};
      allCompletions.forEach((c) => { completionMap[c.exerciseId] = c.completed; });
      setCompletions(completionMap);
      setLoading(false);
      const completed = trackableExercises.filter((ex) => completionMap[ex.id]).length;
      onProgressChange?.(completed, trackableExercises.length);
    }
    loadCompletions();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.date]);

  const handleToggle = useCallback(async (exerciseId: string) => {
    const newCompleted = !completions[exerciseId];
    const next = { ...completions, [exerciseId]: newCompleted };
    setCompletions(next);
    if (newCompleted) triggerCompletion();
    await saveCompletion(exerciseId, workout.date, newCompleted);
    const completed = trackableExercises.filter((ex) => next[ex.id]).length;
    onProgressChange?.(completed, trackableExercises.length);
  }, [completions, workout.date, trackableExercises, onProgressChange]);

  const completedCount = trackableExercises.filter((ex) => completions[ex.id]).length;
  const total = trackableExercises.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (loading) return <WorkoutSkeleton />;

  return (
    <div className="space-y-3 pb-8">
      {workout.blocks.map((block) => {
        const trackable = block.exercises.filter((ex) => ex.category !== "Guidance");
        if (trackable.length === 0) return null;
        const blockDone = trackable.every((ex) => completions[ex.id]);
        const blockCompleted = trackable.filter((ex) => completions[ex.id]).length;

        return (
          <div
            key={block.id}
            className="bg-white dark:bg-[#1B1714] rounded-2xl border border-[#F0E9CE] dark:border-[#3D3730] overflow-hidden"
          >
            {/* Block header — clean row */}
            <div className={`flex items-center justify-between px-5 py-3.5 ${blockDone ? "bg-[#3E7E57]/5 dark:bg-[#3E7E57]/10" : ""}`}>
              <div className="flex items-center gap-2.5">
                {blockDone ? (
                  <span className="w-5 h-5 rounded-full bg-[#3E7E57] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-[#F0E9CE] dark:border-[#3D3730] flex-shrink-0" />
                )}
                <p className={`font-semibold text-sm ${blockDone ? "text-[#3E7E57]" : "text-[#1B1714] dark:text-white"}`}>
                  {block.name}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8A7F78]">
                <span>~{block.estimatedMinutes} min</span>
                <span className="text-[#F0E9CE] dark:text-[#3D3730]">·</span>
                <span className={`font-semibold ${blockDone ? "text-[#3E7E57]" : "text-[#8A7F78]"}`}>
                  {blockCompleted}/{trackable.length}
                </span>
              </div>
            </div>

            {/* Exercise rows — transaction-style list */}
            <div className="divide-y divide-[#F0E9CE] dark:divide-[#3D3730]">
              {trackable.map((exercise) => {
                const isCompleted = completions[exercise.id] || false;
                const isExpanded = expandedId === exercise.id;
                const hasDetails =
                  !!exercise.description ||
                  exercise.instructions.length > 0 ||
                  exercise.commonMistakes.length > 0 ||
                  exercise.stopConditions.length > 0;
                const prescription = formatPrescription(exercise);

                return (
                  <div key={exercise.id} className={`transition-colors ${isCompleted ? "bg-[#F6F3E9] dark:bg-[#1B1714]" : ""}`}>
                    <div className="flex items-center gap-4 px-5 py-3.5">
                      {/* Tap-to-complete circle */}
                      <button
                        type="button"
                        onClick={() => handleToggle(exercise.id)}
                        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                          isCompleted
                            ? "bg-[#3E7E57] border-[#3E7E57]"
                            : "border-[#C5BDB6] dark:border-[#4A433E] hover:border-[#79A98C]"
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Name + prescription */}
                      <button
                        type="button"
                        onClick={() => hasDetails && setExpandedId(isExpanded ? null : exercise.id)}
                        className="flex-1 min-w-0 text-left"
                        disabled={!hasDetails}
                      >
                        <p className={`text-sm font-medium leading-snug ${
                          isCompleted
                            ? "line-through text-[#C5BDB6] dark:text-[#4A433E]"
                            : "text-[#1B1714] dark:text-white"
                        }`}>
                          {exercise.name}
                        </p>
                        {prescription && (
                          <p className={`text-xs mt-0.5 ${isCompleted ? "text-[#D4CFC9] dark:text-[#4A433E]" : "text-[#8A7F78]"}`}>
                            {prescription}
                          </p>
                        )}
                      </button>

                      {/* Right side: chevron if expandable */}
                      {hasDetails && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : exercise.id)}
                          className="flex-shrink-0 p-1 -mr-1"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <svg
                            className={`w-4 h-4 text-[#C5BDB6] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Expandable detail */}
                    {isExpanded && hasDetails && (
                      <div className="px-5 pb-4 border-t border-[#F0E9CE] dark:border-[#3D3730] bg-[#F6F3E9] dark:bg-[#1B1714]">
                        <ExerciseDetailPreview
                          exercise={exercise}
                          onOpenDetailView={exercise.media.type === "video" ? onOpenDetailView : undefined}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* All done */}
      {pct === 100 && total > 0 && (
        <div className="flex items-center gap-3 bg-[#3E7E57]/8 border border-[#3E7E57]/20 rounded-2xl px-5 py-4">
          <span className="w-9 h-9 rounded-full bg-[#3E7E57] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-[#3E7E57]">All {total} done — great work</p>
            <p className="text-xs text-[#8A7F78] mt-0.5">Your streak is safe. See you tomorrow.</p>
          </div>
        </div>
      )}
    </div>
  );
}
