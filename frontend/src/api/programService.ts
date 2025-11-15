import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Program {
  id?: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  status: "live" | "upcoming" | "ended";
  startDate: string;
  endDate: string;
}

export interface ProgramResponse {
  programs: Program[];
}

export const fetchPrograms = async (): Promise<Program[]> => {
  const res = await axios.get<ProgramResponse>(`${BASE_URL}/programs-data/`);
  return res.data.programs;
};

export const updateProgramsData = async (
  programs: Program[]
): Promise<{ message: string }> => {
  const payload = { programs };
  const res = await axios.put(`${BASE_URL}/update-programs-data/`, payload);
  return res.data;
};

export const deleteProgram = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/delete-program-item/${id}/`);
  return res.data;
};
