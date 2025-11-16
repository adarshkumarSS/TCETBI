import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "contact" | "program" | "blog" | "application" | "general";
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
  const res = await axios.get<NotificationResponse>(`${BASE_URL}/notifications/`);
  return res.data.notifications;
};

export const markNotificationRead = async (id: number) => {
  const res = await axios.post(`${BASE_URL}/notifications/read/${id}/`);
  return res.data;
};

export const deleteNotification = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/notifications/delete/${id}/`);
  return res.data;
};
