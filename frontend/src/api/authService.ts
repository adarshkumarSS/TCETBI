import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface UserAuth {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

interface UserAuthResponse {
  refresh: string;
  access: string;
  user: UserAuth;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface UserRegistrationData {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getUserAuthHeaders = () => {
  const token = localStorage.getItem('user_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  async adminLogin(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/admin-login/`, data);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const refresh = localStorage.getItem('admin_refresh');
    if (!refresh) throw new Error('No refresh token');
    const response = await axios.post<{access: string}>(`${BASE_URL}/auth/refresh/`, { refresh });
    const newAccessToken = response.data.access;
    localStorage.setItem('admin_token', newAccessToken);
    return newAccessToken;
  },

  async adminLogout(refreshToken: string): Promise<void> {
    await axios.post(`${BASE_URL}/auth/admin-logout/`, { refresh: refreshToken }, {
      headers: getAuthHeaders()
    });
  },

  async getAdminProfile(): Promise<User> {
    const response = await axios.get<{user: User}>(`${BASE_URL}/auth/admin-profile/`, {
      headers: getAuthHeaders()
    });
    return response.data.user;
  },

  async changePassword(data: PasswordChangeData): Promise<{message: string}> {
    const response = await axios.post(`${BASE_URL}/auth/change-password/`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async userRegister(data: UserRegistrationData): Promise<{message: string, user: User}> {
    const response = await axios.post(`${BASE_URL}/auth/user-register/`, data);
    return response.data;
  },

  async userLogin(data: {username: string, password: string}): Promise<UserAuthResponse> {
    const response = await axios.post<UserAuthResponse>(`${BASE_URL}/auth/user-login/`, data);
    return response.data;
  },

  async userLogout(): Promise<void> {
    const refresh = localStorage.getItem('user_refresh');
    if (refresh) {
      await axios.post(`${BASE_URL}/auth/user-logout/`, { refresh }, {
        headers: getUserAuthHeaders()
      });
    }
  },

  // User auth headers getter for other services
  getUserAuthHeaders: getUserAuthHeaders,
};

export default authService;
