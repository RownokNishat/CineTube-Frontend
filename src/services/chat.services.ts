"use server";

import { cookies } from "next/headers";
import { isDynamicServerUsageError } from "@/lib/isDynamicServerUsageError";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchApi = async (endpoint: string, options?: RequestInit) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        const res = await fetch(`${BASE_API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken ?? ""}; better-auth.session_token=${sessionToken ?? ""}`,
                ...(options?.headers || {}),
            },
        });

        if (!res.ok) {
            return { success: false, message: "API Request Failed", data: null };
        }

        const json = await res.json();
        return json;
    } catch (error) {
        if (isDynamicServerUsageError(error)) {
            throw error;
        }
        return { success: false, message: "Network Error", data: null };
    }
};

export const createSession = async () => {
    return fetchApi('/chat/session', { method: "POST" });
};

export const getMySessions = async () => {
    return fetchApi('/chat/my-sessions', { method: "GET" });
};

export const getAdminSessions = async () => {
    return fetchApi('/chat/admin-sessions', { method: "GET" });
};

export const getSessionMessages = async (sessionId: string) => {
    return fetchApi(`/chat/session/${sessionId}/messages`, { method: "GET" });
};

export const sendMessage = async (payload: { chatSessionId: string, content?: string, imageUrl?: string }) => {
    return fetchApi('/chat/message', {
        method: "POST",
        body: JSON.stringify(payload)
    });
};

export const updateSessionStatus = async (sessionId: string, status: "OPEN" | "RESOLVED") => {
    return fetchApi(`/chat/session/${sessionId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
    });
};
