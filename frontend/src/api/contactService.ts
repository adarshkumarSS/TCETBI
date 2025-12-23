import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface TBICEO {
  id?: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  experience: string;
  email?: string | null;
  linkedin?: string | null;
}

export interface TBIContactInfo {
  id?: number;
  address: string;
  phone: string;
  email: string;
  working_hours: string;

  quick_title: string;
  quick_subtitle: string;

  office_address: string;
  contact_phone: string;
  contact_email: string;
  website: string | null;

  map_embed_url: string;
}

export interface TBIContactResponse {
  contact: TBIContactInfo | null;
}

export const fetchTBIContactData = async (): Promise<TBIContactResponse> => {
  const res = await axios.get<TBIContactResponse>(
    `${BASE_URL}/tbi-contact-data/`
  );
  return res.data;
};

export const updateTBIContactData = async (data: {
  contact: TBIContactInfo | null;
}): Promise<{ message: string }> => {
  const res = await axios.put(`${BASE_URL}/update-tbi-contact-data/`, data);
  return res.data;
};
