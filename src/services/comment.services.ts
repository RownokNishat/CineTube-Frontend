import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Comment } from "@/types/review.types";

export interface CommentQueryParams {
    reviewId: string;
    page?: number;
    limit?: number;
}

export async function getComments(params: CommentQueryParams): Promise<ApiResponse<Comment[]>> {
    return httpClient.get<Comment[]>("/comments", { params: params as unknown as Record<string, unknown> });
}

export async function createComment(payload: { reviewId: string; content: string; parentId?: string | null }): Promise<ApiResponse<Comment>> {
    return httpClient.post<Comment>("/comments", payload);
}

export async function toggleCommentLike(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.post<{ liked: boolean }>(`/comments/${id}/like`, {});
}
