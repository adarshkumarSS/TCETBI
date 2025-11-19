import axios from "axios";

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
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
};

export default userService;
