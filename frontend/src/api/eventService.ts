import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Event {
    id?: number;
    title: string;
    description: string;
    image: string;
    duration: string;
    status: "live" | "upcoming" | "ended";
    startDate: string;
    endDate: string;
    link?: string;
}

export interface EventResponse {
    events: Event[];
}

export const fetchEvents = async (): Promise<Event[]> => {
    const res = await axios.get<EventResponse>(`${BASE_URL}/events-data/`);
    return res.data.events;
};

export const updateEventsData = async (
    events: Event[]
): Promise<{ message: string }> => {
    const payload = { events };
    const res = await axios.put(`${BASE_URL}/update-events-data/`, payload);
    return res.data;
};

export const deleteEvent = async (id: number) => {
    const res = await axios.delete(`${BASE_URL}/delete-event-item/${id}/`);
    return res.data;
};
