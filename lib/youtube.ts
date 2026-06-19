/** Normalize a YouTube watch URL, youtu.be link, embed URL, or 11-char ID to embed format. */
export function normalizeYoutubeEmbedUrl(urlOrId: string): string | undefined {
  const v = urlOrId.trim();
  if (!v) return undefined;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = v.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return undefined;
}
