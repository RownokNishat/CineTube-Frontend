import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Comment } from "@/types/review.types";

export interface CommentQueryParams {
    reviewId: string;
    page?: number;
    limit?: number;
}

export interface AdminCommentQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "PENDING" | "PUBLISHED" | "UNPUBLISHED";
    reviewId?: string;
    sort?: string;
}

export async function getComments(params: CommentQueryParams): Promise<ApiResponse<Comment[]>> {
    const { reviewId, ...rest } = params;
    return httpClient.get<Comment[]>(`/reviews/${reviewId}/comments`, {
        params: rest as Record<string, unknown>,
    });
}

export async function createComment(payload: { reviewId: string; content: string; parentId?: string | null }): Promise<ApiResponse<Comment>> {
    const { reviewId, parentId, ...rest } = payload;

    if (parentId) {
        return httpClient.post<Comment>(`/reviews/comments/${parentId}/replies`, rest);
    }

    return httpClient.post<Comment>(`/reviews/${reviewId}/comments`, rest);
}

export async function likeComment(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.post<{ liked: boolean }>(`/reviews/comments/${id}/like`, {});
}

export async function unlikeComment(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.delete<{ liked: boolean }>(`/reviews/comments/${id}/like`);
}

export async function getAdminComments(params?: AdminCommentQueryParams): Promise<ApiResponse<Comment[]>> {
    return httpClient.get<Comment[]>("/reviews/admin/comments", {
        params: params as Record<string, unknown>,
    });
}

export async function approveComment(id: string): Promise<ApiResponse<Comment>> {
    return httpClient.patch<Comment>(`/reviews/comments/${id}/approve`, {});
}

export async function unpublishComment(id: string): Promise<ApiResponse<Comment>> {
    return httpClient.patch<Comment>(`/reviews/comments/${id}/unpublish`, {});
}

export async function deleteCommentAsAdmin(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/reviews/comments/${id}/admin`);
}
