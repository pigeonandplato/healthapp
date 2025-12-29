"use client";

import { useState, useEffect } from "react";
import { getSetting, saveSetting } from "@/lib/db";

type SpotifyType = 'track' | 'album' | 'playlist' | 'artist';

interface SpotifyContent {
  type: SpotifyType;
  id: string;
}

export default function SpotifyEmbedPlayer() {
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [savedContent, setSavedContent] = useState<SpotifyContent | null>(null);
  const [error, setError] = useState("");

  // Load saved content on mount
  useEffect(() => {
    async function loadContent() {
      const savedType = await getSetting("spotify_content_type");
      const savedId = await getSetting("spotify_content_id");
      if (savedId && savedType) {
        setSavedContent({ type: savedType as SpotifyType, id: savedId });
        setInput(savedId);
      }
    }
    loadContent();
  }, []);

  const extractSpotifyContent = (input: string): SpotifyContent | null => {
    const trimmed = input.trim();
    
    // Remove query parameters (like ?si=...)
    const cleanInput = trimmed.split('?')[0];
    
    // Check if it's already just an ID (22 characters)
    if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
      // Default to playlist if just ID provided
      return { type: 'playlist', id: trimmed };
    }
    
    // Extract from URL - handle both /track/ and /embed/track/ formats
    const urlPatterns = [
      { type: 'track' as SpotifyType, regex: /(?:^|\/)(?:embed\/)?track\/([a-zA-Z0-9]{22})/ },
      { type: 'album' as SpotifyType, regex: /(?:^|\/)(?:embed\/)?album\/([a-zA-Z0-9]{22})/ },
      { type: 'playlist' as SpotifyType, regex: /(?:^|\/)(?:embed\/)?playlist\/([a-zA-Z0-9]{22})/ },
      { type: 'artist' as SpotifyType, regex: /(?:^|\/)(?:embed\/)?artist\/([a-zA-Z0-9]{22})/ },
    ];
    
    // Also handle Spotify URI format: spotify:track:xxx
    const uriPatterns = [
      { type: 'track' as SpotifyType, regex: /spotify:track:([a-zA-Z0-9]{22})/ },
      { type: 'album' as SpotifyType, regex: /spotify:album:([a-zA-Z0-9]{22})/ },
      { type: 'playlist' as SpotifyType, regex: /spotify:playlist:([a-zA-Z0-9]{22})/ },
      { type: 'artist' as SpotifyType, regex: /spotify:artist:([a-zA-Z0-9]{22})/ },
    ];
    
    // Try URL patterns first
    for (const { type, regex } of urlPatterns) {
      const match = cleanInput.match(regex);
      if (match && match[1]) {
        return { type, id: match[1] };
      }
    }
    
    // Try URI patterns
    for (const { type, regex } of uriPatterns) {
      const match = trimmed.match(regex);
      if (match && match[1]) {
        return { type, id: match[1] };
      }
    }
    
    return null;
  };

  const handleSave = async () => {
    if (!input.trim()) {
      setError("Please enter a Spotify URL or ID");
      return;
    }
    
    const content = extractSpotifyContent(input);
    
    if (!content) {
      setError("Invalid Spotify URL. Please use a track, album, playlist, or artist link.");
      return;
    }
    
    // Validate ID is 22 characters
    if (content.id.length !== 22) {
      setError("Invalid ID format. Spotify IDs are 22 characters.");
      return;
    }
    
    setError("");
    await saveSetting("spotify_content_type", content.type);
    await saveSetting("spotify_content_id", content.id);
    setSavedContent(content);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsMinimized(false);
    setError("");
  };

  const getEmbedUrl = (content: SpotifyContent): string => {
    // Remove query parameters and use clean embed URL
    return `https://open.spotify.com/embed/${content.type}/${content.id}?utm_source=generator&theme=0`;
  };

  const getTypeLabel = (type: SpotifyType): string => {
    const labels = {
      track: 'Track',
      album: 'Album',
      playlist: 'Playlist',
      artist: 'Artist',
    };
    return labels[type];
  };

  if (!savedContent && !isEditing) {
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
              Spotify URL (Track, Album, Playlist, or Artist)
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="https://open.spotify.com/track/7zTa8koyemfmBv8r4Jy2ti"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Supports tracks, albums, playlists, and artists. Some tracks may not be embeddable.
            </p>
            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-2 rounded-xl transition-all"
            >
              Save
            </button>
            {savedContent && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setInput(savedContent.id);
                  setError("");
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
          <h3 className="text-white text-sm font-semibold">
            🎵 {savedContent ? getTypeLabel(savedContent.type) : 'Workout'} Music
          </h3>
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
        {savedContent && (
          <iframe
            src={getEmbedUrl(savedContent)}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-xl"
            title={`Spotify ${getTypeLabel(savedContent.type)}`}
          />
        )}
      </div>
    </div>
  );
}
