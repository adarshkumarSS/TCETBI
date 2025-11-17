import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitIncubationApplication = async (formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/apply-incubation/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const getIncubationApplications = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/incubation-applications/`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const updateApplicationStatus = async (id: number, status: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/incubation-applications/${id}/status/`, {
      status,
    }, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};
