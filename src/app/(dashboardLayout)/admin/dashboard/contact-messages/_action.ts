"use server";

import { markContactMessageAsRead } from "@/services/content.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ContactMessage } from "@/types/content.types";

const getActionErrorMessage = (error: unknown, fallback: string): string => {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
    ) {
        return error.response.data.message;
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
};

export async function markContactMessageReadAction(
    id: string
): Promise<ApiResponse<ContactMessage> | ApiErrorResponse> {
    try {
        return await markContactMessageAsRead(id);
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to mark as read") };
    }
}
