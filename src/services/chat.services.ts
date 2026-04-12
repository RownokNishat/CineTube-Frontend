import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import axios from "axios";

interface ChatSessionPayload {
    id: string;
    status: "OPEN" | "RESOLVED";
    createdAt?: string;
    updatedAt?: string;
}

interface ChatMessagePayload {
    id: string;
    senderId: string;
    content?: string | null;
    imageUrl?: string | null;
    createdAt: string;
}

const toApiError = <TData>(error: unknown): ApiResponse<TData> => {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message || error.message || "API Request Failed";
        return { success: false, message, data: null as TData } as unknown as ApiResponse<TData>;
    }

    return { success: false, message: "Network Error", data: null as TData } as unknown as ApiResponse<TData>;
};

export const createSession = async (): Promise<ApiResponse<ChatSessionPayload>> => {
    try {
        return await httpClient.post<ChatSessionPayload>("/chat/session", {});
    } catch (error) {
        return toApiError<ChatSessionPayload>(error);
    }
};

export const getMySessions = async (params?: { page?: number; limit?: number }): Promise<ApiResponse<ChatSessionPayload[]>> => {
    try {
        return await httpClient.get<ChatSessionPayload[]>("/chat/my-sessions", { params: params as Record<string, unknown> | undefined });
    } catch (error) {
        return toApiError<ChatSessionPayload[]>(error);
    }
};

export const getAdminSessions = async (params?: { page?: number; limit?: number }): Promise<ApiResponse<ChatSessionPayload[]>> => {
    try {
        return await httpClient.get<ChatSessionPayload[]>("/chat/admin-sessions", { params: params as Record<string, unknown> | undefined });
    } catch (error) {
        return toApiError<ChatSessionPayload[]>(error);
    }
};

export const getSessionMessages = async (sessionId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<ChatMessagePayload[]>> => {
    try {
        return await httpClient.get<ChatMessagePayload[]>(`/chat/session/${sessionId}/messages`, { params: params as Record<string, unknown> | undefined });
    } catch (error) {
        return toApiError<ChatMessagePayload[]>(error);
    }
};

export const sendMessage = async (payload: { chatSessionId: string; content?: string; imageUrl?: string }): Promise<ApiResponse<ChatMessagePayload>> => {
    try {
        return await httpClient.post<ChatMessagePayload>("/chat/message", payload);
    } catch (error) {
        return toApiError<ChatMessagePayload>(error);
    }
};

export const updateSessionStatus = async (sessionId: string, status: "OPEN" | "RESOLVED"): Promise<ApiResponse<ChatSessionPayload>> => {
    try {
        return await httpClient.patch<ChatSessionPayload>(`/chat/session/${sessionId}/status`, { status });
    } catch (error) {
        return toApiError<ChatSessionPayload>(error);
    }
};
