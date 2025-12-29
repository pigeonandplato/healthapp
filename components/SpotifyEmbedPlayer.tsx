"use client";

import { useState, useEffect } from "react";
import { getSetting, saveSetting } from "@/lib/db";

export default function SpotifyEmbedPlayer() {
  const [playlistId, setPlaylistId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [savedPlaylistId, setSavedPlaylistId] = useState<string | null>(null);

  // Load saved playlist on mount
  useEffect(() => {
    async function loadPlaylist() {
      const saved = await getSetting("spotify_playlist_id");
      if (saved) {
        setSavedPlaylistId(saved);
        setPlaylistId(saved);
      }
    }
    loadPlaylist();
  }, []);

  const handleSave = async () => {
    if (!playlistId.trim()) return;
    
    // Extract playlist ID from URL if full URL provided
    let extractedId = playlistId.trim();
    const urlMatch = playlistId.match(/playlist\/([a-zA-Z0-9]+)/);
    if (urlMatch) {
      extractedId = urlMatch[1];
    }
    
    await saveSetting("spotify_playlist_id", extractedId);
    setSavedPlaylistId(extractedId);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsMinimized(false);
  };

  if (!savedPlaylistId && !isEditing) {
    return (
      <button
        onClick={handleEdit}
        className="fixed bottom-24 right-4 bg-[#1DB954] text-white px-6 py-3 rounded-full shadow-lg font-semibold z-30 flex items-center gap-2"
      >
        <span>🎵</span>
        <span>Add Music</span>
      </button>
    );
  }

  if (isEditing) {
    return (
      <div className="fixed bottom-24 left-4 right-4 bg-black/95 backdrop-blur-xl rounded-2xl p-4 z-30 shadow-2xl">
        <div className="space-y-3">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Spotify Playlist URL or ID
            </label>
            <input
              type="text"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
              placeholder="https://open.spotify.com/playlist/... or playlist ID"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste a Spotify playlist URL or just the playlist ID
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-2 rounded-xl transition-all"
            >
              Save
            </button>
            {savedPlaylistId && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPlaylistId(savedPlaylistId);
                }}
                className="px-4 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 bg-[#1DB954] text-white px-4 py-3 rounded-full shadow-lg font-semibold z-30 flex items-center gap-2"
      >
        <span>🎵</span>
        <span>Show Music</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-30">
      <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-sm font-semibold">🎵 Workout Music</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="text-white/70 hover:text-white text-sm px-2 py-1"
            >
              Edit
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/70 hover:text-white text-lg px-2"
            >
              −
            </button>
          </div>
        </div>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${savedPlaylistId}?utm_source=generator&theme=0&t=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

