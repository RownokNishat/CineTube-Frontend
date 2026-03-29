"use server"

import { deleteReview, updateReview } from "@/services/review.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type Review } from "@/types/review.types"

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

export const updateReviewAction = async (
    id: string,
    payload: { status: string }
): Promise<ApiResponse<Review> | ApiErrorResponse> => {
    try {
        return await updateReview(id, payload)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to update review") }
    }
}

export const deleteReviewAction = async (
    id: string
): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await deleteReview(id)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to delete review") }
    }
}
