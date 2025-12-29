"use client";

import { useState } from "react";
import { saveYouTubeVideo } from "@/lib/db";

interface YouTubeVideoEditorProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
}

export default function YouTubeVideoEditor({ initialUrl, onSave }: YouTubeVideoEditorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [editing, setEditing] = useState(!initialUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleSave = async () => {
    setError("");
    
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube link.");
      return;
    }

    setSaving(true);
    try {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      await onSave(embedUrl);
      setEditing(false);
    } catch (err) {
      setError("Failed to save video. Please try again.");
      console.error("Error saving video:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUrl(initialUrl);
    setEditing(false);
    setError("");
  };

  if (!editing && initialUrl) {
    return (
      <div className="space-y-4">
        <div className="aspect-video rounded-xl overflow-hidden bg-[#E5E5EA] dark:bg-[#38383A]">
          <iframe
            src={initialUrl}
            title="Motivation Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <button
          onClick={() => setEditing(true)}
          className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all"
        >
          Edit Video
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] dark:text-white mb-2">
          YouTube Video URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] dark:border-[#38383A] focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none transition text-[#1C1C1E] dark:text-white bg-white dark:bg-[#1C1C1E]"
        />
        <p className="text-xs text-[#8E8E93] mt-2">
          Enter a YouTube URL or video ID. Examples: youtube.com/watch?v=..., youtu.be/..., or just the video ID
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-[#FF2D55] hover:bg-[#FF6482] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Video"}
        </button>
        {initialUrl && (
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1C1C1E] dark:text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

