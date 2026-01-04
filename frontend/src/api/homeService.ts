// src/api/homeService.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ✅ Types reused everywhere
export interface VisionMission {
  vision: string;
  mission: string;
}

export interface Achievement {
  id?: number;
  number: number;
  suffix: string;
  label: string;
}

export interface Logo {
  id?: number;
  name: string;
  src: string;
  category: "govt" | "state";
}

export interface SuccessStory {
  id?: number;
  title: string;
  description: string;
  image: string;
  sector: string;
  impact: string;
}

export interface HomeData {
  vision_mission: VisionMission;
  achievements: Achievement[];
  govt_logos: Logo[];
  state_logos: Logo[];
  success_stories: SuccessStory[];
}

// ✅ Fetch all home data (Frontend + Admin use)
export const fetchHomeData = async (): Promise<HomeData> => {
  const response = await axios.get<HomeData>(`${BASE_URL}/home-data/`);
  return response.data;
};

// ✅ Update all data (for admin save)
export const updateHomeData = async (data: HomeData | FormData) => {
  const isFormData = data instanceof FormData;
  const response = await axios.put(`${BASE_URL}/update-home-data/`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const deleteSuccessStory = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/delete-success-story/${id}/`);
  return res.data;
};