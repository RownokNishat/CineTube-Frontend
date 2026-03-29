"use server";

import { createMedia, deleteMedia, updateMedia } from "@/services/media.services";
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types";
import { type Media } from "@/types/media.types";

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
    if (error instanceof Error) return error.message;
    return fallback;
};

export const createMediaAction = async (
    formData: FormData
): Promise<ApiResponse<Media> | ApiErrorResponse> => {
    try {
        return await createMedia(formData);
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create media"),
        };
    }
};

export const updateMediaAction = async (
    id: string,
    formData: FormData
): Promise<ApiResponse<Media> | ApiErrorResponse> => {
    try {
        return await updateMedia(id, formData);
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to update media"),
        };
    }
};

export const deleteMediaAction = async (
    id: string
): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await deleteMedia(id);
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to delete media"),
        };
    }
};
