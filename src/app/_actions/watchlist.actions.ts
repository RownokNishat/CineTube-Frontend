"use server"

import { addToWatchlist, removeFromWatchlist } from "@/services/watchlist.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"

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
        return error.response.data.message
    }
    if (error instanceof Error) return error.message
    return fallback
}

export const addToWatchlistAction = async (
    mediaId: string
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    try {
        return await addToWatchlist(mediaId)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to add to watchlist") }
    }
}

export const removeFromWatchlistAction = async (
    mediaId: string
): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await removeFromWatchlist(mediaId)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to remove from watchlist") }
    }
}
