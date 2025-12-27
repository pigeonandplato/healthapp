"use client";

import { useState, useEffect, useRef } from "react";
import { Exercise, ExerciseCompletion } from "@/lib/types";
import { saveCompletion } from "@/lib/db";

interface ExerciseCardProps {
  exercise: Exercise;
  date: string;
  completion: ExerciseCompletion | undefined;
  onCompletionChange: (exerciseId: string, completed: boolean) => void;
}

export default function ExerciseCard({
  exercise,
  date,
  completion,
  onCompletionChange,
}: ExerciseCardProps) {
  const [isCompleted, setIsCompleted] = useState(completion?.completed || false);
  const [notes, setNotes] = useState(completion?.notes || "");
  const [showMistakes, setShowMistakes] = useState(false);
  const [showStopConditions, setShowStopConditions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lazy loading using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Update local state when completion prop changes
  useEffect(() => {
    setIsCompleted(completion?.completed || false);
    setNotes(completion?.notes || "");
  }, [completion]);

  const handleToggleComplete = async () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    await saveCompletion(exercise.id, date, newCompleted, notes);
    onCompletionChange(exercise.id, newCompleted);
  };

  const handleNotesChange = async (value: string) => {
    setNotes(value);
    await saveCompletion(exercise.id, date, isCompleted, value);
  };

  const formatPrescription = () => {
    const p = exercise.prescription;
    const parts: string[] = [];

    if (p.sets) parts.push(`${p.sets} sets`);
    if (p.reps) parts.push(`${p.reps} reps`);
    if (p.holdSeconds) parts.push(`${p.holdSeconds}s hold`);
    if (p.minutes) parts.push(`${p.minutes} min`);
    if (p.description) return p.description;

    return parts.join(" × ");
  };

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] hover:-translate-y-1 ${
        isCompleted ? "ring-4 ring-green-400/50" : ""
      }`}
    >
      {/* Completion Badge - Top Left Corner */}
      {isCompleted && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-3 shadow-2xl animate-bounce-once">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Exercise Media - Embedded Video with Image Fallback */}
      {isVisible && (
        <div className="relative overflow-hidden bg-black">
          {/* YouTube Video Embed */}
          {exercise.media.type === "video" && exercise.media.videoUrl && showVideo && !videoError ? (
            <div className="relative">
              <iframe
                src={exercise.media.videoUrl}
                className="w-full h-64 bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.media.alt}
                onError={() => setVideoError(true)}
              />
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <a
                  href={exercise.media.videoUrl.replace("/embed/", "/watch?v=")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  YouTube
                </a>
                {exercise.media.src && (
                  <button
                    onClick={() => setShowVideo(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                  >
                    Show Image
                  </button>
                )}
              </div>
            </div>
          ) : exercise.media.src ? (
            /* Fallback to Image */
            <div className="relative">
              <img
                src={exercise.media.src}
                alt={exercise.media.alt}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              {exercise.media.type === "video" && exercise.media.videoUrl && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <a
                    href={exercise.media.videoUrl.replace("/embed/", "/watch?v=")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    YouTube
                  </a>
                  <button
                    onClick={() => {
                      setShowVideo(true);
                      setVideoError(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Show Video
                  </button>
                </div>
              )}
              {videoError && (
                <div className="absolute bottom-2 left-2 bg-yellow-500 text-black text-xs font-bold py-1 px-3 rounded-full">
                  Video unavailable - showing image
                </div>
              )}
            </div>
          ) : exercise.media.type === "svg" && exercise.media.svg ? (
            /* SVG fallback */
            <div
              className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4"
              dangerouslySetInnerHTML={{ __html: exercise.media.svg }}
            />
          ) : null}
        </div>
      )}

      {/* Exercise Content */}
      <div className="p-6 space-y-4">
        {/* Header with Number Badge */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-xl">
            {/* Exercise number would go here - for now showing checkmark */}
            {isCompleted ? "✓" : "○"}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">
              {exercise.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
              {formatPrescription()}
            </p>
          </div>

          {/* Complete Toggle - Larger and More Prominent */}
          <button
            onClick={handleToggleComplete}
            className={`flex-shrink-0 w-16 h-16 rounded-2xl border-3 flex items-center justify-center transition-all shadow-xl ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 scale-110"
                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-green-400 hover:scale-105"
            }`}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 dark:border-gray-600"></div>
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {exercise.description}
        </p>

        {/* Instructions */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            How to Perform:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5">
            {exercise.instructions.map((instruction, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {instruction}
              </li>
            ))}
          </ol>
        </div>

        {/* Common Mistakes (Collapsible) */}
        <div className="mb-3">
          <button
            onClick={() => setShowMistakes(!showMistakes)}
            className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            aria-expanded={showMistakes}
          >
            <span className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm">
              ⚠️ Common Mistakes
            </span>
            <svg
              className={`w-5 h-5 text-yellow-700 dark:text-yellow-300 transition-transform ${
                showMistakes ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showMistakes && (
            <ul className="mt-2 space-y-1.5 pl-3">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex gap-2"
                >
                  <span className="text-yellow-600 dark:text-yellow-400">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stop Conditions (Collapsible) */}
        <div className="mb-4">
          <button
            onClick={() => setShowStopConditions(!showStopConditions)}
            className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            aria-expanded={showStopConditions}
          >
            <span className="font-semibold text-red-900 dark:text-red-200 text-sm">
              🛑 Stop If You Feel
            </span>
            <svg
              className={`w-5 h-5 text-red-700 dark:text-red-300 transition-transform ${
                showStopConditions ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showStopConditions && (
            <ul className="mt-2 space-y-1.5 pl-3">
              {exercise.stopConditions.map((condition, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex gap-2"
                >
                  <span className="text-red-600 dark:text-red-400">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor={`notes-${exercise.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notes (optional)
          </label>
          <textarea
            id={`notes-${exercise.id}`}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="How did this feel? Any modifications?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

