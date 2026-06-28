"use client";

import { useState, useEffect } from "react";
import { formatLongDate, toLocalDateString, isValidIsoDate } from "@/lib/dates";

interface ProgramStartDateControlProps {
  title?: string;
  description?: string;
  getStartDate: () => Promise<string>;
  setStartDate: (date: string) => Promise<void>;
  onSaved?: () => void;
}

export default function ProgramStartDateControl({
  title = "Program start date",
  description = "Week 1 of your plan begins on this date. Phases and week numbers are calculated from here.",
  getStartDate,
  setStartDate,
  onSaved,
}: ProgramStartDateControlProps) {
  const [savedDate, setSavedDate] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getStartDate().then((d) => {
      if (!active) return;
      setSavedDate(d);
      setDraft(d);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [getStartDate]);

  const handleSave = async () => {
    if (!isValidIsoDate(draft)) {
      setMessage("Pick a valid date.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setStartDate(draft);
      setSavedDate(draft);
      setMessage("Saved ✓ Week 1 starts on this date.");
      onSaved?.();
    } catch {
      setMessage("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-24 animate-pulse bg-[#EDE8DC] dark:bg-[#2C2C2E] rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-[#E5E5EA] dark:border-[#38383A] bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 mt-4">
      <h3 className="font-semibold text-[#1C1C1E] dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-[#8E8E93] mb-3">{description}</p>

      {savedDate && (
        <p className="text-xs text-[#8E8E93] mb-3">
          Currently: Week 1 began <strong className="text-[#1C1C1E] dark:text-white">{formatLongDate(savedDate)}</strong>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="date"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full !py-3 rounded-xl border border-[#E5E5EA] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-[#1C1C1E] dark:text-white"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDraft(toLocalDateString(new Date()))}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] text-[#1C1C1E] dark:text-white"
          >
            Use today
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || draft === savedDate}
            className="flex-1 min-w-[140px] py-2 text-sm font-semibold rounded-xl bg-[#FF2D55] hover:bg-[#FF6482] text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save start date"}
          </button>
        </div>
      </div>

      {message && (
        <p className={`text-sm mt-2 ${message.includes("✓") ? "text-[#34C759]" : "text-[#FF9500]"}`}>{message}</p>
      )}
    </div>
  );
}
