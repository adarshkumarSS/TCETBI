import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ✅ Startup model
export interface CEO {
  name: string;
  image: string;
  bio: string;
}

export interface Startup {
  id?: number;
  name: string;
  logo: string;
  description: string;
  sector: string;
  founded: string;
  website: string;
  location?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  category: "current" | "graduated";
  ceos: CEO[];
  owner_name?: string;
  owner_description?: string;
  owner_company_name?: string;
  owner_linkedin?: string;
}

// ✅ Returned object shape from backend
export interface PortfolioData {
  current_startups: Startup[];
  graduated_startups: Startup[];
}

// ✅ Fetch all portfolio data
export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  const response = await axios.get<PortfolioData>(`${BASE_URL}/portfolio-data/`);
  return response.data;
};

export const updatePortfolioData = async (data: PortfolioData | FormData) => {
  const isFormData = data instanceof FormData;
  const res = await axios.put(`${BASE_URL}/update-portfolio-data/`, data, {
    headers: {},
  });
  return res.data;
};

export const deleteStartup = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:8000/api/delete-startup/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed with ${response.status}`);
  return response.json();
};

