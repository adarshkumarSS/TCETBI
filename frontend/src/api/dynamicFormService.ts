import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Public endpoints for dynamic forms
export const dynamicFormService = {
    // Get form structure
    getFormStructure: async (formType: string) => {
        const response = await axios.get(`${API_URL}/forms/${formType}/`);
        return response.data;
    },

    // Submit form
    submitForm: async (formType: string, formData: FormData) => {
        const response = await axios.post(`${API_URL}/forms/${formType}/submit/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
