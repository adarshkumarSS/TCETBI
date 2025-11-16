import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const submitContactMessage = async (data: ContactMessagePayload) => {
  const res = await axios.post(`${BASE_URL}/contact-message/`, data);
  return res.data;
};
