"use client";

import { useState, useEffect, useRef } from "react";
import { formatTime, saveBlockTimer, getBlockTimer } from "@/lib/db";
import { BlockTimerState } from "@/lib/types";

interface BlockTimerProps {
  blockId: string;
  date: string;
}

export default function BlockTimer({ blockId, date }: BlockTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved timer state on mount
  useEffect(() => {
    async function loadTimer() {
      const saved = await getBlockTimer(blockId, date);
      if (saved) {
        setElapsedSeconds(saved.elapsedSeconds);
        // Don't auto-resume running state (user needs to manually start)
      }
    }
    loadTimer();
  }, [blockId, date]);

  // Handle timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Save timer state when it changes
  useEffect(() => {
    const saveTimer = async () => {
      const timerState: BlockTimerState = {
        blockId,
        date,
        elapsedSeconds,
        isRunning,
        lastUpdated: new Date().toISOString(),
      };
      await saveBlockTimer(timerState);
    };

    // Debounce saves (only save every 5 seconds if running, or immediately if paused)
    const timeoutId = setTimeout(
      () => {
        saveTimer();
      },
      isRunning ? 5000 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [elapsedSeconds, isRunning, blockId, date]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  return (
    <div className="flex items-center gap-3 bg-[#FDFAF6] dark:bg-[#2C2C2E] rounded-lg p-3">
      <div className="text-2xl font-mono font-bold text-[#1C1C1E] dark:text-white min-w-[80px]">
        {formatTime(elapsedSeconds)}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleStartPause}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isRunning
              ? "bg-[#EDE8DC]0 hover:bg-yellow-600 text-white"
              : "bg-[#4A8FA8] hover:bg-[#4A8FA8] text-white"
          }`}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-[#38383A] dark:hover:bg-[#48484A] text-[#1C1C1E] dark:text-white rounded-md font-medium transition-colors"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>

      {isRunning && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-[#9DBFD0]/100 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}



