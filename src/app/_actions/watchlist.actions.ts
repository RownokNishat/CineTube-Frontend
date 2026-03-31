"use server"

import { addToWatchlist, removeFromWatchlist, checkWatchlistStatus, clearWatchlist, getWatchlist } from "@/services/watchlist.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type WatchlistItem } from "@/types/subscription.types"

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

const getActionStatusCode = (error: unknown): number | undefined => {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        typeof error.response.status === "number"
    ) {
        return error.response.status
    }
    return undefined
}

export const getWatchlistAction = async (): Promise<ApiResponse<WatchlistItem[]> | ApiErrorResponse> => {
    try {
        return await getWatchlist()
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to load watchlist"),
            statusCode: getActionStatusCode(error),
        }
    }
}

export const addToWatchlistAction = async (
    mediaId: string
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    try {
        return await addToWatchlist(mediaId)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to add to watchlist"),
            statusCode: getActionStatusCode(error),
        }
    }
}

export const removeFromWatchlistAction = async (
    mediaId: string
): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await removeFromWatchlist(mediaId)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to remove from watchlist"),
            statusCode: getActionStatusCode(error),
        }
    }
}

export const checkWatchlistStatusAction = async (
    mediaId: string
): Promise<ApiResponse<{ inWatchlist: boolean }> | ApiErrorResponse> => {
    try {
        return await checkWatchlistStatus(mediaId)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to check watchlist status"),
            statusCode: getActionStatusCode(error),
        }
    }
}

export const clearWatchlistAction = async (): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await clearWatchlist()
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to clear watchlist"),
            statusCode: getActionStatusCode(error),
        }
    }
}
