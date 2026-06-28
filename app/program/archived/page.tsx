"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ProgramInfo } from "@/lib/types";
import { getArchivedPrograms, unarchiveProgram } from "@/lib/db";
import ProgramListCard from "@/components/ProgramListCard";

export default function ArchivedProgramsPage() {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramInfo[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const archived = await getArchivedPrograms();
    setPrograms(archived);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRestore = async (program: ProgramInfo) => {
    await unarchiveProgram(program.type);
    setMessage(`${program.name} is back on your Programs list.`);
    await load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4A8FA8]" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <section className="bg-gradient-to-br from-[#2C2C2E] via-[#1C1C1E] to-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/program"
            className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Programs
          </Link>
          <h2 className="text-2xl font-bold mb-2">Archived Programs 📦</h2>
          <p className="text-white/90 text-sm">
            Programs you hid from your main list. Restore anytime — your progress stays saved.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 rounded-xl bg-[#3F6B40]/10 dark:bg-[#3F6B40]/20 border border-[#3F6B40]/20 dark:border-[#3F6B40]/40 px-4 py-3 text-sm text-[#3F6B40] dark:text-[#87A87C]">
            {message}
          </div>
        )}

        {programs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-[#8E8E93] dark:text-[#8E8E93] mb-6">No archived programs yet.</p>
            <Link
              href="/program"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Programs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <ProgramListCard
                key={prog.id}
                program={prog}
                action={{
                  label: "Restore",
                  variant: "restore",
                  onClick: () => handleRestore(prog),
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
