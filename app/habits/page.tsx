"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Intervention, HabitKind, buildIntervention } from "@/lib/habitCoach";
import {
  UserHabit,
  getHabits,
  addHabit,
  deleteHabit,
  toggleWinToday,
  wonToday,
  habitStreak,
  winCount,
} from "@/lib/habits";
import { triggerCompletion, triggerHaptic } from "@/utils/haptics";

const QUICK_ADD: Record<HabitKind, { label: string; emoji: string }[]> = {
  break: [
    { label: "Stop eating out", emoji: "🍔" },
    { label: "Put phone down", emoji: "📱" },
    { label: "Don't skip rehab break", emoji: "🦵" },
    { label: "No doomscrolling", emoji: "🌀" },
    { label: "Skip the sugar snack", emoji: "🍬" },
  ],
  build: [
    { label: "Cook a meal", emoji: "🍳" },
    { label: "Take a 5-min walk", emoji: "🚶" },
    { label: "Do a rehab break", emoji: "🧘" },
    { label: "Drink water", emoji: "💧" },
  ],
};

async function fetchIntervention(label: string, kind: HabitKind): Promise<Intervention> {
  try {
    const res = await fetch("/api/habit-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, kind }),
    });
    if (!res.ok) throw new Error("bad response");
    return (await res.json()) as Intervention;
  } catch {
    // Offline / server error: fall back to the same engine on the client so a
    // user mid-urge still gets help.
    return buildIntervention(label, kind);
  }
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [kind, setKind] = useState<HabitKind>("break");
  const [label, setLabel] = useState("");
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>("");
  const coachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  const scrollToCoach = useCallback(() => {
    requestAnimationFrame(() => {
      coachRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openCoach = useCallback(
    async (text: string, k: HabitKind) => {
      setActiveLabel(text);
      setLoadingCoach(true);
      setIntervention(null);
      scrollToCoach();
      const result = await fetchIntervention(text, k);
      setIntervention(result);
      setLoadingCoach(false);
      scrollToCoach();
    },
    [scrollToCoach]
  );

  const handleHelpNow = async () => {
    const text = label.trim();
    if (!text) return;
    const created = addHabit(text, kind);
    setHabits((h) => [created, ...h]);
    setLabel("");
    triggerHaptic("medium");
    await openCoach(text, kind);
  };

  const handleSaveForLater = () => {
    const text = label.trim();
    if (!text) return;
    const created = addHabit(text, kind);
    setHabits((h) => [created, ...h]);
    setLabel("");
    triggerHaptic("light");
  };

  const handleQuickAdd = async (text: string, helpNow: boolean) => {
    const created = addHabit(text, kind);
    setHabits((h) => [created, ...h]);
    if (helpNow) {
      triggerHaptic("medium");
      await openCoach(text, kind);
    } else {
      triggerHaptic("light");
    }
  };

  const handleStruggling = (habit: UserHabit) => {
    triggerHaptic("medium");
    openCoach(habit.label, habit.kind);
  };

  const handleToggleWin = (habit: UserHabit) => {
    const updated = toggleWinToday(habit.id);
    setHabits(getHabits());
    if (updated && wonToday(updated)) triggerCompletion();
  };

  const handleDelete = (habit: UserHabit) => {
    deleteHabit(habit.id);
    setHabits(getHabits());
    if (activeLabel === habit.label) {
      setIntervention(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-28">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#5856D6] via-[#7B7AE8] to-[#FF6482] text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-sm font-medium text-white/90 uppercase tracking-wide mb-1">Habit Coach</p>
          <h1 className="text-2xl font-bold leading-tight mb-2">Beat the urge in the moment</h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Type what you&apos;re about to do and get an instant ADHD-friendly intervention — tied to your knee &amp; back
            recovery. No guilt. The minimum win always counts.
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Add habit */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
          {/* Kind toggle */}
          <div className="inline-flex w-full rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] p-1 mb-4">
            {(
              [
                { k: "break" as HabitKind, label: "🛑 Stop doing" },
                { k: "build" as HabitKind, label: "🌱 Start doing" },
              ]
            ).map((opt) => (
              <button
                key={opt.k}
                onClick={() => setKind(opt.k)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  kind === opt.k
                    ? "bg-white dark:bg-[#1C1C1E] text-[#1C1C1E] dark:text-white shadow-sm"
                    : "text-[#8E8E93]"
                }`}
                aria-pressed={kind === opt.k}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom label */}
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleHelpNow();
            }}
            placeholder={kind === "break" ? "e.g. about to order pizza" : "e.g. cook dinner tonight"}
            className="w-full rounded-xl border border-[#E5E5EA] dark:border-[#38383A] bg-[#F9F9FB] dark:bg-[#2C2C2E] px-4 py-3.5 text-base text-[#1C1C1E] dark:text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#5856D6] mb-3"
          />

          {/* Quick-add chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_ADD[kind].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setLabel(chip.label)}
                className="px-3 py-2 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-sm font-medium text-[#1C1C1E] dark:text-white border border-transparent hover:border-[#5856D6] transition-colors active:scale-95"
              >
                <span className="mr-1">{chip.emoji}</span>
                {chip.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <button
            onClick={handleHelpNow}
            disabled={!label.trim()}
            className="w-full bg-[#5856D6] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg mb-2"
          >
            ⚡ Help me now
          </button>
          <button
            onClick={handleSaveForLater}
            disabled={!label.trim()}
            className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] disabled:opacity-40 disabled:cursor-not-allowed text-[#1C1C1E] dark:text-white font-semibold py-3 rounded-2xl transition-all active:scale-[0.98]"
          >
            Save for later
          </button>
        </div>

        {/* Coach panel */}
        <div ref={coachRef} className="scroll-mt-[calc(60px+env(safe-area-inset-top))]">
          {loadingCoach && <CoachSkeleton />}
          {!loadingCoach && intervention && (
            <CoachPanel label={activeLabel} intervention={intervention} onClose={() => setIntervention(null)} />
          )}
        </div>

        {/* Saved habits */}
        <div>
          <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white mb-3">
            Your habits {habits.length > 0 && <span className="text-[#8E8E93] font-normal">({habits.length})</span>}
          </h2>

          {habits.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-[#E5E5EA] dark:border-[#38383A]">
              <div className="text-4xl mb-2">💡</div>
              <p className="text-sm text-[#8E8E93]">
                No habits yet. Add one above — or when an urge hits, type it and tap{" "}
                <span className="font-semibold text-[#5856D6]">Help me now</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onStruggling={() => handleStruggling(habit)}
                  onToggleWin={() => handleToggleWin(habit)}
                  onDelete={() => handleDelete(habit)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function HabitCard({
  habit,
  onStruggling,
  onToggleWin,
  onDelete,
}: {
  habit: UserHabit;
  onStruggling: () => void;
  onToggleWin: () => void;
  onDelete: () => void;
}) {
  const isBreak = habit.kind === "break";
  const done = wonToday(habit);
  const streak = habitStreak(habit);
  const total = winCount(habit);

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isBreak
                  ? "bg-[#FF2D55]/10 text-[#FF2D55]"
                  : "bg-[#34C759]/10 text-[#34C759]"
              }`}
            >
              {isBreak ? "Stop" : "Build"}
            </span>
            {streak > 0 && (
              <span className="text-[11px] font-semibold text-[#FF9500]">🔥 {streak}-day</span>
            )}
            {total > 0 && <span className="text-[11px] text-[#8E8E93]">{total} wins</span>}
          </div>
          <p className="font-semibold text-[#1C1C1E] dark:text-white leading-snug break-words">{habit.label}</p>
        </div>
        <button
          onClick={onDelete}
          aria-label="Delete habit"
          className="flex-shrink-0 text-[#C7C7CC] hover:text-[#FF2D55] transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggleWin}
          className={`flex-1 font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] ${
            done
              ? "bg-[#34C759] text-white"
              : "bg-[#34C759]/10 text-[#34C759] hover:bg-[#34C759]/20"
          }`}
        >
          {done ? "✓ Logged today" : isBreak ? "I resisted today" : "I did it today"}
        </button>
        <button
          onClick={onStruggling}
          className="px-4 bg-[#5856D6]/10 text-[#5856D6] hover:bg-[#5856D6]/20 font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
        >
          I&apos;m struggling
        </button>
      </div>
    </div>
  );
}

function CoachPanel({
  label,
  intervention,
  onClose,
}: {
  label: string;
  intervention: Intervention;
  onClose: () => void;
}) {
  const watchUrl = intervention.videoId
    ? `https://www.youtube.com/watch?v=${intervention.videoId}`
    : null;
  const thumb = intervention.videoId
    ? `https://img.youtube.com/vi/${intervention.videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="rounded-3xl border-2 border-[#5856D6]/30 bg-white dark:bg-[#1C1C1E] shadow-elevated overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-[#5856D6] to-[#7B7AE8] text-white px-5 py-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-white/80 mb-1 truncate">Coaching · {label}</p>
          <h3 className="text-lg font-black leading-snug">{intervention.headline}</h3>
        </div>
        <button onClick={onClose} aria-label="Close coach" className="flex-shrink-0 text-white/80 hover:text-white p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-4">
        <InfoRow emoji="🧠" title="What it does to your brain" body={intervention.brainImpact} />
        <InfoRow emoji="🦵" title="What it does to your recovery" body={intervention.bodyImpact} />

        <div className="rounded-2xl bg-[#5856D6]/8 border border-[#5856D6]/20 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#5856D6] mb-1">⚡ Do this instead (2 min)</p>
          <p className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] leading-relaxed">{intervention.doInstead}</p>
        </div>

        <div className="rounded-2xl bg-[#34C759]/10 border border-[#34C759]/25 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#2DA84E] mb-1">🫶 Minimum win (this still counts)</p>
          <p className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] leading-relaxed">{intervention.minimumWin}</p>
        </div>

        {/* Video */}
        {watchUrl && thumb && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt={intervention.videoTitle || "Watch on YouTube"} className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-[#FF2D55] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {intervention.videoTitle && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-semibold">{intervention.videoTitle}</p>
              </div>
            )}
          </a>
        )}

        <a
          href={intervention.youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-semibold py-3 rounded-xl transition-all text-sm"
        >
          <span>▶</span> Find a video on YouTube
        </a>
      </div>
    </div>
  );
}

function InfoRow({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl flex-shrink-0" aria-hidden>
        {emoji}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#8E8E93] mb-0.5">{title}</p>
        <p className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function CoachSkeleton() {
  return (
    <div className="rounded-3xl border-2 border-[#5856D6]/20 bg-white dark:bg-[#1C1C1E] p-5 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <p className="text-center text-sm text-[#8E8E93]">Getting your intervention…</p>
    </div>
  );
}
