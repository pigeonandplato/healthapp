"use client";

import { useState, useRef } from "react";
import { saveSetting } from "@/lib/db";

interface ProgramRow {
  week: number;
  day: string; // A, B, or C
  blockName: string;
  exerciseId: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  minutes?: number;
  description?: string;
}

export default function GoogleSheetsImport() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<ProgramRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = `Week,Day,Block Name,Exercise ID,Exercise Name,Sets,Reps,Hold Seconds,Minutes,Description
1,A,Warm-up,exercise-1,Jumping Jacks,1,10,,,
1,A,Main,exercise-2,Push-ups,3,10,,,
1,B,Warm-up,exercise-3,High Knees,1,20,,,
1,B,Main,exercise-4,Squats,3,15,,,
1,C,Warm-up,exercise-5,Butt Kicks,1,20,,,
1,C,Main,exercise-6,Lunges,3,10,,,`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-program-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ProgramRow[] => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) throw new Error("CSV must have at least a header and one data row");

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows: ProgramRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length < headers.length) continue;

      const row: ProgramRow = {
        week: parseInt(values[headers.indexOf("week")] || "1"),
        day: values[headers.indexOf("day")] || "A",
        blockName: values[headers.indexOf("block name")] || "",
        exerciseId: values[headers.indexOf("exercise id")] || "",
        exerciseName: values[headers.indexOf("exercise name")] || "",
      };

      const setsIdx = headers.indexOf("sets");
      const repsIdx = headers.indexOf("reps");
      const holdIdx = headers.indexOf("hold seconds");
      const minutesIdx = headers.indexOf("minutes");
      const descIdx = headers.indexOf("description");

      if (setsIdx >= 0 && values[setsIdx]) row.sets = parseInt(values[setsIdx]);
      if (repsIdx >= 0 && values[repsIdx]) row.reps = parseInt(values[repsIdx]);
      if (holdIdx >= 0 && values[holdIdx]) row.holdSeconds = parseInt(values[holdIdx]);
      if (minutesIdx >= 0 && values[minutesIdx]) row.minutes = parseInt(values[minutesIdx]);
      if (descIdx >= 0 && values[descIdx]) row.description = values[descIdx];

      rows.push(row);
    }

    return rows;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setSuccess(false);
    setPreview([]);

    if (!selectedFile.name.endsWith(".csv") && !selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setError("Please upload a CSV or Excel file");
      return;
    }

    setParsing(true);
    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);
      
      if (rows.length === 0) {
        setError("No valid data found in the file");
        return;
      }

      setPreview(rows.slice(0, 10)); // Show first 10 rows as preview
    } catch (err: any) {
      setError(err.message || "Failed to parse file. Please check the format.");
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!file || preview.length === 0) return;

    setParsing(true);
    setError("");
    setSuccess(false);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      // Save custom program to settings
      await saveSetting("custom_program", rows);
      
      setSuccess(true);
      setFile(null);
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to import program");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={downloadTemplate}
          className="flex-1 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all"
        >
          Download Template
        </button>
        <label className="flex-1 bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-center">
          {file ? "Change File" : "Upload File"}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {parsing && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2D55] mx-auto mb-2"></div>
          <p className="text-sm text-[#8E8E93]">Parsing file...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
          Program imported successfully! Your custom program is now active.
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#1C1C1E] dark:text-white mb-3">
              Preview ({preview.length} of {file ? "many" : "0"} rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[#8E8E93] border-b border-[#E5E5EA] dark:border-[#38383A]">
                    <th className="pb-2 pr-4">Week</th>
                    <th className="pb-2 pr-4">Day</th>
                    <th className="pb-2 pr-4">Block</th>
                    <th className="pb-2 pr-4">Exercise</th>
                    <th className="pb-2">Sets/Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b border-[#E5E5EA] dark:border-[#38383A]">
                      <td className="py-2 pr-4 text-[#1C1C1E] dark:text-white">{row.week}</td>
                      <td className="py-2 pr-4 text-[#1C1C1E] dark:text-white">{row.day}</td>
                      <td className="py-2 pr-4 text-[#8E8E93]">{row.blockName}</td>
                      <td className="py-2 pr-4 text-[#1C1C1E] dark:text-white">{row.exerciseName}</td>
                      <td className="py-2 text-[#8E8E93]">
                        {row.sets && row.reps ? `${row.sets}x${row.reps}` : row.minutes ? `${row.minutes}min` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={parsing}
            className="w-full bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? "Importing..." : "Import Program"}
          </button>
        </div>
      )}
    </div>
  );
}

