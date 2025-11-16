import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface MediaItem {
  id?: number;
  image: string;         // Cloudinary URL
  title: string;
  description: string;
  album: string;         // album slug
  category: "events" | "facilities" | "startups" | "programs";
}

export interface MediaResponse {
  media: MediaItem[];
}

export const fetchMedia = async (): Promise<MediaItem[]> => {
  const res = await axios.get<MediaResponse>(`${BASE_URL}/media-data/`);

  // 🔥 SAFETY CHECKS → Prevent undefined.map() crash
  if (!res.data || !Array.isArray(res.data.media)) {
    console.warn("⚠️ API returned invalid media data:", res.data);
    return [];
  }

  return res.data.media;
};

export const updateAlbum = async (album: string, items: MediaItem[]) => {
  return axios.put(`${BASE_URL}/update-album/${album}/`, { items });
};

export const deleteAlbum = async (album: string) => {
  return axios.delete(`${BASE_URL}/delete-album/${album}/`);
};