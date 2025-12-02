import axios from "axios";
import authService from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  status: string;
  date_joined: string;
  last_login: string;
}

interface CompanyRequest {
  id?: number;
  user?: number;
  name: string;
  logo?: string;
  description?: string;
  sector: string;
  founded: string;
  website?: string;
  location: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  products: Array<{title: string, desc: string}>;
  ceo_name?: string;
  ceo_image?: string;
  ceo_bio?: string;
  status: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  is_edit_request?: boolean;
  edit_changes_summary?: string;
  original_startup?: number;
}

interface UserProfile {
  user: User;
}

interface CompanyRequestResponse {
  company_request: CompanyRequest;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to make authenticated requests with automatic token refresh
const makeAuthenticatedRequest = async (config: any) => {
  try {
    return await axios(config);
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await authService.refreshUserToken();
        // Retry the request with new token
        const newHeaders = authService.getUserAuthHeaders();
        config.headers = { ...config.headers, ...newHeaders };
        return await axios(config);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_refresh');
        localStorage.removeItem('user_data');
        window.location.href = '/auth';
        throw refreshError;
      }
    }
    throw error;
  }
};

export const userService = {
  // Admin functions
  async getUsers(): Promise<{users: User[]}> {
    const response = await axios.get(`${BASE_URL}/users/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async getPendingUsers(): Promise<{users: User[]}> {
    const response = await axios.get(`${BASE_URL}/users/pending/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async updateUserStatus(userId: number, status: string): Promise<{message: string}> {
    const response = await axios.post(`${BASE_URL}/users/${userId}/status/`, { status }, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async deleteUser(userId: number): Promise<{message: string}> {
    const response = await axios.delete(`${BASE_URL}/users/${userId}/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async createUser(userData: {email: string, password: string, full_name: string, phone?: string}): Promise<{message: string, user: User}> {
    const payload = {
      username: userData.email, // Use email as username
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password, // Required by serializer
      full_name: userData.full_name,
      phone: userData.phone || ''
    };

    const response = await axios.post(`${BASE_URL}/users/create/`, payload, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // User functions
  async getUserProfile(): Promise<UserProfile> {
    const response = await makeAuthenticatedRequest({
      method: 'GET',
      url: `${BASE_URL}/user/profile/`,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async updateUserProfile(profileData: {full_name: string, phone: string}): Promise<UserProfile> {
    const response = await makeAuthenticatedRequest({
      method: 'PUT',
      url: `${BASE_URL}/user/profile/update/`,
      data: profileData,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async getCompanyRequest(): Promise<CompanyRequestResponse> {
    const response = await makeAuthenticatedRequest({
      method: 'GET',
      url: `${BASE_URL}/user/company-request/`,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async updateCompanyRequest(companyData: Partial<CompanyRequest>): Promise<CompanyRequestResponse> {
    // Remove fields that shouldn't be sent to the backend, but keep status for updates
    const { id, user, admin_notes, created_at, updated_at, ...dataToSend } = companyData;

    const response = await makeAuthenticatedRequest({
      method: 'POST',
      url: `${BASE_URL}/user/company-request/update/`,
      data: dataToSend,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async submitCompanyRequest(): Promise<CompanyRequestResponse> {
    const response = await makeAuthenticatedRequest({
      method: 'POST',
      url: `${BASE_URL}/user/company-request/submit/`,
      data: {},
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async deleteCompanyRequest(): Promise<{message: string}> {
    const response = await makeAuthenticatedRequest({
      method: 'DELETE',
      url: `${BASE_URL}/user/company-request/delete/`,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  async submitCompanyEditRequest(editData: Partial<CompanyRequest>): Promise<CompanyRequestResponse> {
    const response = await makeAuthenticatedRequest({
      method: 'POST',
      url: `${BASE_URL}/user/company-request/submit-edit/`,
      data: editData,
      headers: authService.getUserAuthHeaders()
    });
    return response.data;
  },

  // Admin functions for company requests
  async getCompanyRequestsAdmin(): Promise<{company_requests: CompanyRequest[]}> {
    const response = await axios.get(`${BASE_URL}/admin/company-requests/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async reviewCompanyRequest(requestId: number, action: 'approve' | 'reject', remarks: string): Promise<{message: string, company_request: CompanyRequest}> {
    const response = await axios.post(`${BASE_URL}/admin/company-requests/${requestId}/review/`, {
      action,
      remarks
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
};

export default userService;
