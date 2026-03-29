"use server";

import { createGenre } from "@/services/genre.services";
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types";
import { type Genre } from "@/types/media.types";

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

export const createGenreAction = async (
    name: string
): Promise<ApiResponse<Genre> | ApiErrorResponse> => {
    if (!name.trim()) {
        return { success: false, message: "Genre name is required" };
    }
    try {
        return await createGenre(name.trim());
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create genre"),
        };
    }
};
