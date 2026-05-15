import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeader = (): any => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token');
    const headers: any = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return { headers };
};

export const supportService = {
    // Mentors
    getMentors: async () => {
        const response = await axios.get(`${API_URL}/mentors/`, getAuthHeader());
        return response.data;
    },
    createMentor: async (data: any) => {
        const config = getAuthHeader();
        if (data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        const response = await axios.post(`${API_URL}/mentors/`, data, config);
        return response.data;
    },
    updateMentor: async (id: number, data: any) => {
        const config = getAuthHeader();
        if (data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        const response = await axios.patch(`${API_URL}/mentors/${id}/`, data, config);
        return response.data;
    },
    deleteMentor: async (id: number) => {
        const response = await axios.delete(`${API_URL}/mentors/${id}/`, getAuthHeader());
        return response.data;
    },

    // Funding
    submitFundingRequest: async (data: any) => {
        const response = await axios.post(`${API_URL}/support/funding/`, data, getAuthHeader());
        return response.data;
    },
    getFundingRequests: async () => {
        const response = await axios.get(`${API_URL}/support/funding/`, getAuthHeader());
        return response.data;
    },

    // Mentoring
    submitMentoringRequest: async (data: any) => {
        const response = await axios.post(`${API_URL}/support/mentoring/`, data, getAuthHeader());
        return response.data;
    },
    getMentoringRequests: async () => {
        const response = await axios.get(`${API_URL}/support/mentoring/`, getAuthHeader());
        return response.data;
    },

    // Validation
    submitValidationRequest: async (data: any) => {
        const response = await axios.post(`${API_URL}/support/validation/`, data, getAuthHeader());
        return response.data;
    },
    getValidationRequests: async () => {
        const response = await axios.get(`${API_URL}/support/validation/`, getAuthHeader());
        return response.data;
    },

    // Admin Actions
    updateFundingStatus: async (id: number, data: any) => {
        const response = await axios.patch(`${API_URL}/support/funding/${id}/`, data, getAuthHeader());
        return response.data;
    },
    updateMentoringStatus: async (id: number, data: any) => {
        const response = await axios.patch(`${API_URL}/support/mentoring/${id}/`, data, getAuthHeader());
        return response.data;
    },
    updateValidationStatus: async (id: number, data: any) => {
        const response = await axios.patch(`${API_URL}/support/validation/${id}/`, data, getAuthHeader());
        return response.data;
    },
};
