"use server"

import { getComments, createComment } from "@/services/comment.services"
import { createReview, toggleReviewLike } from "@/services/review.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type Comment, type Review } from "@/types/review.types"

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

export const createReviewAction = async (payload: {
    mediaId: string
    rating: number
    content: string
    isSpoiler: boolean
    tags: string[]
}): Promise<ApiResponse<Review> | ApiErrorResponse> => {
    try {
        return await createReview(payload)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to submit review") }
    }
}

export const toggleReviewLikeAction = async (
    reviewId: string
): Promise<ApiResponse<{ liked: boolean }> | ApiErrorResponse> => {
    try {
        return await toggleReviewLike(reviewId)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to toggle like") }
    }
}

export const getCommentsAction = async (
    reviewId: string
): Promise<ApiResponse<Comment[]> | ApiErrorResponse> => {
    try {
        return await getComments({ reviewId })
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to load comments") }
    }
}

export const createCommentAction = async (payload: {
    reviewId: string
    content: string
    parentId?: string | null
}): Promise<ApiResponse<Comment> | ApiErrorResponse> => {
    try {
        return await createComment(payload)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to add comment") }
    }
}
