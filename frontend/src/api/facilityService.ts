// src/api/facilityService.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Facility {
  id?: number;
  name: string;
  description: string;
  image: string; // cloudinary URL or data URL while editing
  features: string[]; // array
  category: "SHARED" | "TCETBI" | string;
}

export interface FacilityVideo {
  id?: number;
  title: string;
  description: string;
  url: string; // full youtube link
  thumbnail: string;
}

export interface FacilityPageData {
  facilities: Facility[];
  videos: FacilityVideo[];
}

export const fetchFacilitiesData = async (): Promise<FacilityPageData> => {
  const res = await axios.get(`${BASE_URL}/facilities-data/`);
  return res.data;
};

export const updateFacilitiesData = async (data: FacilityPageData) => {
  const res = await axios.put(`${BASE_URL}/update-facilities-data/`, data);
  return res.data;
};

export const deleteFacilityItem = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/delete-facility-item/${id}/`);
  return res.data;
};
