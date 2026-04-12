import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';
import axios from 'axios';

export interface AiChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AiChatResponse {
    reply: string;
}

const toApiError = <TData>(error: unknown): ApiResponse<TData> => {
    if (axios.isAxiosError(error)) {
        const message =
            (error.response?.data as { message?: string } | undefined)?.message ||
            error.message ||
            'AI request failed';
        return { success: false, message, data: null as TData } as unknown as ApiResponse<TData>;
    }
    return { success: false, message: 'Network Error', data: null as TData } as unknown as ApiResponse<TData>;
};

export const sendAiMessage = async (
    messages: AiChatMessage[]
): Promise<ApiResponse<AiChatResponse>> => {
    try {
        return await httpClient.post<AiChatResponse>('/ai/chat', { messages });
    } catch (error) {
        return toApiError<AiChatResponse>(error);
    }
};
