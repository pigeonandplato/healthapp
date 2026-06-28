"use client";

import { useState, useRef } from "react";
import { saveCustomProgram, setActiveProgram } from "@/lib/db";
import type { CustomProgramRow } from "@/lib/types";
import {
  parseCustomProgramJson,
  formatTemplateJson,
  CUSTOM_PROGRAM_AI_PROMPT,
} from "@/lib/customProgramJson";

interface CustomProgramImportProps {
  onImported?: () => void;
}

export default function CustomProgramImport({ onImported }: CustomProgramImportProps) {
  const [jsonText, setJsonText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<CustomProgramRow[]>([]);
  const [programName, setProgramName] = useState<string | undefined>();
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const blob = new Blob([formatTemplateJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-program-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(CUSTOM_PROGRAM_AI_PROMPT);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    } catch {
      setShowPrompt(true);
    }
  };

  const runPreview = (text: string, fileName?: string) => {
    setError("");
    setSuccess(false);
    setPreview([]);

    if (!text.trim()) return;

    setParsing(true);
    try {
      const { name, rows } = parseCustomProgramJson(text);
      if (rows.length === 0) {
        setError("No exercises found in JSON.");
        return;
      }
      setPreview(rows);
      setProgramName(
        name ||
          fileName?.replace(/\.(json|txt)$/i, "").replace(/[-_]+/g, " ").trim() ||
          undefined
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON.");
      setPreview([]);
    } finally {
      setParsing(false);
    }
  };

  const handleTextChange = (value: string) => {
    setJsonText(value);
    if (value.trim().length > 20) {
      runPreview(value);
    } else {
      setPreview([]);
      setError("");
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(json|txt)$/i)) {
      setError("Please upload a .json or .txt file");
      return;
    }

    const text = await selectedFile.text();
    setJsonText(text);
    runPreview(text, selectedFile.name);
  };

  const handleImport = async () => {
    if (preview.length === 0 || !jsonText.trim()) return;

    setParsing(true);
    setError("");
    setSuccess(false);

    try {
      const { name, rows } = parseCustomProgramJson(jsonText);
      const finalName = name || programName || "My Custom Program";

      await saveCustomProgram(rows, finalName);
      await setActiveProgram("custom");

      setSuccess(true);
      setJsonText("");
      setPreview([]);
      setProgramName(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";

      onImported?.();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to import program");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[#E5B122]/10 border border-[#E5B122]/20 p-4">
        <h3 className="text-sm font-semibold text-[#1B1714] dark:text-white mb-1">
          ✨ Use your favorite AI
        </h3>
        <p className="text-xs text-[#8A7F78] mb-3">
          Copy the prompt below, paste it into ChatGPT / Claude / Gemini, add your program, then paste the JSON back here.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyPrompt}
            className="px-4 py-2 rounded-lg bg-[#E5B122] text-white text-sm font-semibold"
          >
            {promptCopied ? "Copied!" : "Copy AI prompt"}
          </button>
          <button
            type="button"
            onClick={() => setShowPrompt(!showPrompt)}
            className="px-4 py-2 rounded-lg bg-[#F6F3E9] dark:bg-[#2C2622] text-[#1B1714] dark:text-white text-sm font-medium"
          >
            {showPrompt ? "Hide prompt" : "Show prompt"}
          </button>
          <button
            type="button"
            onClick={downloadTemplate}
            className="px-4 py-2 rounded-lg bg-[#F6F3E9] dark:bg-[#2C2622] text-[#1B1714] dark:text-white text-sm font-medium"
          >
            Download JSON template
          </button>
        </div>
        {showPrompt && (
          <textarea
            readOnly
            value={CUSTOM_PROGRAM_AI_PROMPT}
            rows={12}
            className="mt-3 w-full text-xs font-mono rounded-lg border border-[#F0E9CE] dark:border-[#3D3730] bg-white dark:bg-[#2C2622] p-3 text-[#1B1714] dark:text-white"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B1714] dark:text-white mb-2">
          Paste program JSON
        </label>
        <textarea
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={'{\n  "name": "My Program",\n  "weeks": [ ... ]\n}'}
          rows={10}
          className="w-full rounded-xl border border-[#F0E9CE] dark:border-[#3D3730] bg-white dark:bg-[#2C2622] p-4 text-sm font-mono text-[#1B1714] dark:text-white placeholder:text-[#8A7F78] focus:border-[#79A98C] outline-none"
        />
      </div>

      <label className="block w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-center text-sm">
        Or upload .json file
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt,application/json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      {parsing && (
        <div className="text-center py-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79A98C] mx-auto mb-2" />
          <p className="text-sm text-[#8A7F78]">Checking JSON…</p>
        </div>
      )}

      {error && (
        <div className="bg-[#9DC1A5]/10 dark:bg-[#9DC1A5]/8 text-[#8A7F78] dark:text-[#8A7F78] px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-[#3E7E57]/10 dark:bg-[#3E7E57]/20 text-[#3E7E57] dark:text-[#9DC1A5] px-4 py-3 rounded-xl text-sm border border-[#3E7E57]/20 dark:border-[#3E7E57]/30">
          Imported and set as your active program! Runs Mon / Wed / Fri (A / B / C). Head to Today to start.
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-4">
          {programName && (
            <p className="text-sm text-[#8A7F78]">
              Program: <span className="font-semibold text-[#1B1714] dark:text-white">{programName}</span>
              {" · "}
              {preview.length} exercises
            </p>
          )}

          <div className="bg-[#F6F3E9] dark:bg-[#2C2622] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#1B1714] dark:text-white mb-3">
              Preview (first {Math.min(10, preview.length)} exercises)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[#8A7F78] border-b border-[#F0E9CE] dark:border-[#3D3730]">
                    <th className="pb-2 pr-4">Week</th>
                    <th className="pb-2 pr-4">Day</th>
                    <th className="pb-2 pr-4">Block</th>
                    <th className="pb-2 pr-4">Exercise</th>
                    <th className="pb-2 pr-4">Sets/Reps</th>
                    <th className="pb-2">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b border-[#F0E9CE] dark:border-[#3D3730]">
                      <td className="py-2 pr-4 text-[#1B1714] dark:text-white">{row.week}</td>
                      <td className="py-2 pr-4 text-[#1B1714] dark:text-white">{row.day}</td>
                      <td className="py-2 pr-4 text-[#8A7F78]">{row.blockName}</td>
                      <td className="py-2 pr-4 text-[#1B1714] dark:text-white">{row.exerciseName}</td>
                      <td className="py-2 text-[#8A7F78]">
                        {row.sets && row.reps
                          ? `${row.sets}×${row.reps}`
                          : row.holdSeconds
                            ? `${row.holdSeconds}s`
                            : row.minutes
                              ? `${row.minutes} min`
                              : "—"}
                      </td>
                      <td className="py-2 text-[#8A7F78]">{row.videoUrl ? "▶️" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={parsing}
            className="w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? "Importing…" : "Import program"}
          </button>
        </div>
      )}
    </div>
  );
}
