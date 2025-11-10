import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Person {
  id?: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  experience?: string;
  email?: string;
  linkedin?: string;
}

export interface PeopleData {
  founder: Person;
  ceo: Person;
  board_members: Person[];
}

export const fetchPeopleData = async (): Promise<PeopleData> => {
  const res = await axios.get(`${BASE_URL}/people-data/`);
  return res.data;
};

export const updatePeopleData = async (data: PeopleData) => {
  const res = await axios.put(`${BASE_URL}/update-people-data/`, data);
  return res.data;
};

export const deleteBoardMember = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/delete-board-member/${id}/`);
  return res.data;
};
