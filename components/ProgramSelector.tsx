"use client";

import { useState, useEffect } from "react";
import { ProgramType, ProgramInfo } from "../lib/types";
import { getAvailablePrograms, getActiveProgram, setActiveProgram } from "../lib/db";

interface ProgramSelectorProps {
  onProgramChange?: (program: ProgramType) => void;
  compact?: boolean;
}

export default function ProgramSelector({ onProgramChange, compact = false }: ProgramSelectorProps) {
  const [activeProgram, setActiveProgramState] = useState<ProgramType>("adhd");
  const [programs, setPrograms] = useState<ProgramInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const [current, available] = await Promise.all([getActiveProgram(), getAvailablePrograms()]);
      setActiveProgramState(current);
      setPrograms(available);
    }
    load();
  }, []);

  const handleSelect = async (programType: ProgramType) => {
    setActiveProgramState(programType);
    await setActiveProgram(programType);
    setIsOpen(false);
    onProgramChange?.(programType);
  };

  const currentProgram = programs.find((p) => p.type === activeProgram);

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
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1B1714] rounded-xl border border-[#3D3730] overflow-hidden z-50">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => handleSelect(program.type)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2C2622] transition-colors ${
                    program.type === activeProgram ? "bg-[#79A98C]/30" : ""
                  }`}
                >
                  <span className="text-2xl">{program.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-white">{program.name}</div>
                    <div className="text-xs text-[#8A7F78]">{program.description}</div>
                  </div>
                  {program.type === activeProgram && (
                    <svg className="w-5 h-5 text-[#79A98C] ml-auto" fill="currentColor" viewBox="0 0 20 20">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {programs.map((program) => (
        <button
          key={program.id}
          onClick={() => handleSelect(program.type)}
          className={`p-4 rounded-xl border-2 transition-all ${
            program.type === activeProgram
              ? "border-[#79A98C] bg-[#79A98C]/20"
              : "border-[#3D3730] bg-[#1B1714]/50 hover:border-[#4A433E]"
          }`}
        >
          <div className="text-3xl mb-2">{program.icon}</div>
          <div className="font-semibold text-white">{program.name}</div>
          <div className="text-xs text-[#8A7F78] mt-1">{program.description}</div>
        </button>
      ))}
    </div>
  );
}
