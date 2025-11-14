// src/utils/youtube.ts
export const extractYouTubeID = (url: string): string | null => {
  if (!url) return null;
  // common youtube url patterns
  const reg =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,11})/;
  const m = url.match(reg);
  return m ? m[1] : null;
};

export const youtubeThumbnailFromUrl = (url: string): string | null => {
  const id = extractYouTubeID(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};