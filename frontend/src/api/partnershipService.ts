import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Partnership {
    id?: number;
    name: string;
    logo: string;
    description: string;
    website?: string | null;
}

export interface PartnershipResponse {
    partnerships: Partnership[];
}

export const fetchPartnerships = async (): Promise<Partnership[]> => {
    const res = await axios.get<PartnershipResponse>(`${BASE_URL}/partnerships-data/`);
    return res.data.partnerships;
};

export const updatePartnershipsData = async (
    partnerships: Partnership[]
): Promise<{ message: string }> => {
    const payload = { partnerships };
    const res = await axios.put(`${BASE_URL}/update-partnerships-data/`, payload);
    return res.data;
};

export const deletePartnership = async (id: number) => {
    const res = await axios.delete(`${BASE_URL}/delete-partnership-item/${id}/`);
    return res.data;
};
