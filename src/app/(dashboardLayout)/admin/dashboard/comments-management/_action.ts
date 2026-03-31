"use server";

import {
    approveComment,
    deleteCommentAsAdmin,
    unpublishComment,
} from "@/services/comment.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { Comment } from "@/types/review.types";

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

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};

export async function approveCommentAction(
    commentId: string
): Promise<ApiResponse<Comment> | ApiErrorResponse> {
    try {
        return await approveComment(commentId);
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to approve comment") };
    }
}

export async function unpublishCommentAction(
    commentId: string
): Promise<ApiResponse<Comment> | ApiErrorResponse> {
    try {
        return await unpublishComment(commentId);
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to unpublish comment") };
    }
}

export async function deleteCommentAsAdminAction(
    commentId: string
): Promise<ApiResponse<null> | ApiErrorResponse> {
    try {
        return await deleteCommentAsAdmin(commentId);
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to delete comment") };
    }
}
