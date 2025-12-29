import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin endpoints for form builder
export const formBuilderService = {
    // Form Templates
    listTemplates: async () => {
        const response = await axios.get(`${API_URL}/admin/forms/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getTemplate: async (formType: string) => {
        const response = await axios.get(`${API_URL}/admin/forms/${formType}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    createTemplate: async (data: any) => {
        const response = await axios.post(`${API_URL}/admin/forms/create/`, data, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateTemplate: async (templateId: number, data: any) => {
        const response = await axios.put(`${API_URL}/admin/forms/${templateId}/update/`, data, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteTemplate: async (templateId: number) => {
        await axios.delete(`${API_URL}/admin/forms/${templateId}/delete/`, {
            headers: getAuthHeaders()
        });
    },

    // Form Fields
    addField: async (templateId: number, fieldData: any) => {
        const response = await axios.post(`${API_URL}/admin/forms/${templateId}/fields/`, fieldData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateField: async (fieldId: number, fieldData: any) => {
        const response = await axios.put(`${API_URL}/admin/forms/fields/${fieldId}/update/`, fieldData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteField: async (fieldId: number) => {
        await axios.delete(`${API_URL}/admin/forms/fields/${fieldId}/delete/`, {
            headers: getAuthHeaders()
        });
    },

    reorderFields: async (templateId: number, fieldOrders: Array<{ id: number, order: number }>) => {
        const response = await axios.put(`${API_URL}/admin/forms/${templateId}/reorder/`, {
            field_orders: fieldOrders
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Submissions
    listSubmissions: async (formType?: string, status?: string) => {
        const params = new URLSearchParams();
        if (formType) params.append('form_type', formType);
        if (status) params.append('status', status);

        const response = await axios.get(`${API_URL}/admin/submissions/?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getSubmission: async (submissionId: number) => {
        const response = await axios.get(`${API_URL}/admin/submissions/${submissionId}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateSubmissionStatus: async (submissionId: number, status: string, adminNotes?: string) => {
        const response = await axios.put(`${API_URL}/admin/submissions/${submissionId}/status/`, {
            status,
            admin_notes: adminNotes
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },
};
