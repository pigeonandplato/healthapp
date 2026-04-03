"use client";

import { useState, useEffect } from "react";
import { ProgramType, ProgramInfo } from "../lib/types";
import { AVAILABLE_PROGRAMS, getActiveProgram, setActiveProgram } from "../lib/db";

interface ProgramSelectorProps {
  onProgramChange?: (program: ProgramType) => void;
  compact?: boolean;
}

export default function ProgramSelector({ onProgramChange, compact = false }: ProgramSelectorProps) {
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("running");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getActiveProgram().then(setActiveProgramState);
  }, []);

  const handleSelect = async (programType: ProgramType) => {
    setActiveProgramState(programType);
    await setActiveProgram(programType);
    setIsOpen(false);
    onProgramChange?.(programType);
  };

  const currentProgram = AVAILABLE_PROGRAMS.find((p) => p.type === activeProgram);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <span className="text-lg">{currentProgram?.icon}</span>
          <span className="text-sm font-medium">{currentProgram?.name}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50">
              {AVAILABLE_PROGRAMS.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleSelect(program.type)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                    program.type === activeProgram ? "bg-blue-600/30" : ""
                  }`}
                >
                  <span className="text-2xl">{program.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-white">{program.name}</div>
                    <div className="text-xs text-gray-400">{program.description}</div>
                  </div>
                  {program.type === activeProgram && (
                    <svg className="w-5 h-5 text-blue-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {AVAILABLE_PROGRAMS.map((program) => (
        <button
          key={program.id}
          onClick={() => handleSelect(program.type)}
          className={`p-4 rounded-xl border-2 transition-all ${
            program.type === activeProgram
              ? "border-blue-500 bg-blue-500/20"
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          }`}
        >
          <div className="text-3xl mb-2">{program.icon}</div>
          <div className="font-semibold text-white">{program.name}</div>
          <div className="text-xs text-gray-400 mt-1">{program.description}</div>
        </button>
      ))}
    </div>
  );
}
