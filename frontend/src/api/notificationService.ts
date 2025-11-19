import axios from "axios";
import authService from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance for notifications
const notificationApi = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to include auth headers
notificationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
notificationApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Attempting token refresh for notification API');
        const newToken = await authService.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return notificationApi(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed, logging out', refreshError);
        // If refresh fails, logout
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh');
        localStorage.removeItem('admin_user');
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "contact" | "program" | "blog" | "application" | "user_registration" | "general";
  is_read: boolean;
  created_at: string;

  // 🔥 Fix: make meta optional + typed
  meta?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  } | null;
}

export interface NotificationResponse {
  notifications: Notification[];
}

export const fetchNotifications = async () => {
  const res = await notificationApi.get<NotificationResponse>('/notifications/');
  return res.data.notifications;
};

export const markNotificationRead = async (id: number) => {
  const res = await notificationApi.post(`/notifications/read/${id}/`, {});
  return res.data;
};

export const deleteNotification = async (id: number) => {
  const res = await notificationApi.delete(`/notifications/delete/${id}/`);
  return res.data;
};
