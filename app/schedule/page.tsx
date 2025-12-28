"use client";

import { useState, useEffect } from "react";
import { getProgramMetaForDate, PROGRAM_PHASES } from "@/lib/program";
import { getBlocksForProgramMeta } from "@/lib/seedData";
import type { ProgramMeta } from "@/lib/types";
import Link from "next/link";

type ScheduleDay = {
  date: string;
  meta: ProgramMeta;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewWeeks, setViewWeeks] = useState(4);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      const items: ScheduleDay[] = [];
      const today = new Date().toISOString().split('T')[0];
      
      for (let i = 0; i < viewWeeks * 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const meta = await getProgramMetaForDate(dateStr);
        const dayName = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        items.push({ 
          date: dateStr, 
          meta, 
          dayName,
          isToday: dateStr === today,
          isPast: dateStr < today,
        });
      }
      setSchedule(items);
      setLoading(false);
    }
    loadSchedule();
  }, [viewWeeks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  const weekGroups = schedule.reduce((weeks, item, i) => {
    const weekIndex = Math.floor(i / 7);
    if (!weeks[weekIndex]) weeks[weekIndex] = [];
    weeks[weekIndex].push(item);
    return weeks;
  }, [] as ScheduleDay[][]);

  const getDayEmoji = (day: string) => {
    switch (day) {
      case 'A': return '💪';
      case 'B': return '🏋️';
      case 'C': return '🚴';
      default: return '📋';
    }
  };

  const getDayDescription = (meta: ProgramMeta) => {
    const blocks = getBlocksForProgramMeta(meta);
    const totalMinutes = blocks.reduce((sum, b) => sum + b.estimatedMinutes, 0);
    const blockNames = blocks.map(b => b.name).join(', ');
    return { totalMinutes, blockNames, blockCount: blocks.length };
  };

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#34C759] via-[#30D158] to-[#007AFF] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-1">📅 Your Schedule</h2>
          <p className="text-white/90 text-sm">Day-by-day workout plan • Next {viewWeeks} weeks</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* View Controls */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setViewWeeks(2)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              viewWeeks === 2 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            2 Weeks
          </button>
          <button
            onClick={() => setViewWeeks(4)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              viewWeeks === 4 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            4 Weeks
          </button>
          <button
            onClick={() => setViewWeeks(8)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              viewWeeks === 8 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            8 Weeks
          </button>
        </div>

        {/* Schedule by Week */}
        <div className="space-y-6">
          {weekGroups.map((week, weekIdx) => {
            const firstDay = week[0];
            const phase = PROGRAM_PHASES.find(p => p.phase === firstDay.meta.phase);
            
            return (
              <div key={weekIdx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        Week {firstDay.meta.week} • {phase?.phase}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {phase?.title.split('(')[0].trim()}
                      </p>
                    </div>
                    <div className="text-sm text-blue-100">
                      {phase?.running === 'none' ? '🚶 No running' :
                       phase?.running === 'run-walk' ? '🏃 Run-walk' :
                       phase?.running === 'continuous' ? '🏃 Continuous' :
                       '🏃‍♂️ Durability'}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {week.map((item) => {
                    const { totalMinutes, blockNames, blockCount } = getDayDescription(item.meta);
                    const isExpanded = expandedDay === item.date;

                    return (
                      <div
                        key={item.date}
                        className={`rounded-xl border-2 overflow-hidden transition ${
                          item.isToday
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-500 shadow-lg'
                            : item.isPast
                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60'
                            : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedDay(isExpanded ? null : item.date)}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{getDayEmoji(item.meta.day)}</div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  {item.dayName}
                                  {item.isToday && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Day {item.meta.day} • {blockCount} blocks • ~{totalMinutes} min
                                </div>
                              </div>
                            </div>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                            {getBlocksForProgramMeta(item.meta).filter((b) => b.id !== "rules-global").map((block) => (
                              <div
                                key={block.id}
                                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3"
                              >
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                  {block.name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {block.description}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {block.exercises.length} exercises • ~{block.estimatedMinutes} min
                                </div>
                              </div>
                            ))}
                            {item.isToday && (
                              <Link
                                href="/today"
                                className="block mt-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded-lg transition"
                              >
                                Start Today's Workout →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {viewWeeks < 24 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setViewWeeks(Math.min(24, viewWeeks + 4))}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition"
            >
              Load More Weeks
            </button>
          </div>
        )}
      </main>
    </div>
  );
}



