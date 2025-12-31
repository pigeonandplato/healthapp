"use client";

import { useState, useEffect, useRef } from "react";
import { Exercise, ExerciseCompletion } from "@/lib/types";
import { saveCompletion, getCustomExerciseVideo, saveCustomExerciseVideo, deleteCustomExerciseVideo, getMasterExerciseVideo, saveMasterExerciseVideo, getUserEmail } from "@/lib/db";
import { triggerCompletion } from "@/utils/haptics";

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
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [masterVideoUrl, setMasterVideoUrl] = useState<string | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [editVideoInput, setEditVideoInput] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoEditError, setVideoEditError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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

  // Load custom video and master video on mount, check if admin
  useEffect(() => {
    async function loadVideos() {
      if (exercise.media.type === "video") {
        // Check if user is admin
        const email = await getUserEmail();
        const admin = email === "gilljugnu1@gmail.com";
        setIsAdmin(admin);
        
        // Load master video (for all users)
        const master = await getMasterExerciseVideo(exercise.id);
        setMasterVideoUrl(master);
        
        // Load custom video (user-specific override)
        const custom = await getCustomExerciseVideo(exercise.id);
        setCustomVideoUrl(custom);
      }
    }
    loadVideos();
  }, [exercise.id, exercise.media.type]);

  // Get the video URL to use (priority: custom > master > default)
  const getVideoUrl = (): string | null => {
    if (customVideoUrl) return customVideoUrl;
    if (masterVideoUrl) return masterVideoUrl;
    return exercise.media.videoUrl || null;
  };

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Handle video editing
  const handleStartEditVideo = () => {
    const currentUrl = getVideoUrl();
    setEditVideoInput(currentUrl?.replace("/embed/", "/watch?v=") || "");
    setIsEditingVideo(true);
    setVideoEditError("");
  };

  const handleSaveVideo = async () => {
    setVideoEditError("");
    
    if (!editVideoInput.trim()) {
      setVideoEditError("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(editVideoInput.trim());
    if (!videoId) {
      setVideoEditError("Invalid YouTube URL. Please enter a valid YouTube link.");
      return;
    }

    setSavingVideo(true);
    try {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
      // If admin, save to master video (affects all users)
      if (isAdmin) {
        await saveMasterExerciseVideo(exercise.id, embedUrl);
        setMasterVideoUrl(embedUrl);
        // Also clear any custom video for admin
        setCustomVideoUrl(null);
      } else {
        // Regular user: save to custom video (only affects this user)
        await saveCustomExerciseVideo(exercise.id, embedUrl);
        setCustomVideoUrl(embedUrl);
      }
      
      setShowVideo(true);
      setVideoError(false);
      setIsEditingVideo(false);
    } catch (err) {
      setVideoEditError("Failed to save video. Please try again.");
      console.error("Error saving video:", err);
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteCustomVideo = async () => {
    setSavingVideo(true);
    try {
      await deleteCustomExerciseVideo(exercise.id);
      setCustomVideoUrl(null);
      setShowVideo(true);
      setVideoError(false);
      setIsEditingVideo(false);
    } catch (err) {
      setVideoEditError("Failed to delete custom video. Please try again.");
      console.error("Error deleting video:", err);
    } finally {
      setSavingVideo(false);
    }
  };

  const handleToggleComplete = async () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    await saveCompletion(exercise.id, date, newCompleted, notes);
    onCompletionChange(exercise.id, newCompleted);
    if (newCompleted) {
      triggerCompletion();
    }
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
    
    // Only allow horizontal swipe (not vertical scrolling)
    if (deltaY > 30) {
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }
    
    // Only allow right swipe (to complete)
    if (deltaX > 0 && !isCompleted) {
      setSwipeOffset(Math.min(deltaX, 120));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 80 && !isCompleted) {
      // Swiped enough to complete
      handleToggleComplete();
    }
    setSwipeOffset(0);
    setIsSwiping(false);
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] hover:-translate-y-1 touch-pan-y ${
        isCompleted ? "ring-4 ring-green-400/50" : ""
      }`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Swipe indicator */}
      {swipeOffset > 20 && !isCompleted && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
          <div className="w-12 h-12 rounded-full bg-[#34C759] flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Quick Complete Button - Always visible, large */}
      {!isCompleted && (
        <button
          onClick={handleToggleComplete}
          className="absolute bottom-4 right-4 w-14 h-14 bg-[#FF2D55] rounded-full shadow-2xl flex items-center justify-center text-white text-2xl z-20 transform transition-all hover:scale-110 active:scale-95 touch-manipulation"
          aria-label="Complete exercise"
        >
          ✓
        </button>
      )}
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
          {exercise.media.type === "video" && getVideoUrl() && showVideo && !videoError ? (
            <div className="relative">
              <iframe
                src={getVideoUrl()!}
                className="w-full h-64 bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.media.alt}
                onError={() => setVideoError(true)}
              />
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={handleStartEditVideo}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-1"
                  title="Edit video"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <a
                  href={getVideoUrl()!.replace("/embed/", "/watch?v=")}
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
              {exercise.media.type === "video" && getVideoUrl() && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={handleStartEditVideo}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-1"
                    title="Edit video"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <a
                    href={getVideoUrl()!.replace("/embed/", "/watch?v=")}
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
            💪
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
            className={`flex-shrink-0 w-16 h-16 rounded-2xl border-3 flex items-center justify-center transition-all shadow-xl touch-manipulation ${
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

      {/* Video Editor Modal */}
      {isEditingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-[#1C1C1E] dark:text-white">
              Edit Video for {exercise.name}
            </h3>
            {isAdmin && (
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  ⚡ Admin Mode: This will update the master video for all users
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1E] dark:text-white mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  value={editVideoInput}
                  onChange={(e) => {
                    setEditVideoInput(e.target.value);
                    setVideoEditError("");
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] dark:border-[#38383A] focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none transition text-[#1C1C1E] dark:text-white bg-white dark:bg-[#1C1C1E]"
                />
                <p className="text-xs text-[#8E8E93] mt-2">
                  Enter a YouTube URL or video ID. Examples: youtube.com/watch?v=..., youtu.be/..., or just the video ID
                </p>
              </div>

              {videoEditError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  {videoEditError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSaveVideo}
                  disabled={savingVideo}
                  className="flex-1 bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingVideo ? "Saving..." : "Save Video"}
                </button>
                {customVideoUrl && (
                  <button
                    onClick={handleDeleteCustomVideo}
                    disabled={savingVideo}
                    className="px-4 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsEditingVideo(false);
                    setVideoEditError("");
                  }}
                  disabled={savingVideo}
                  className="px-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

