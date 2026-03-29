import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { CreateReviewPayload, Review } from "@/types/review.types";

export interface ReviewQueryParams {
    mediaId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export async function getReviews(params?: ReviewQueryParams): Promise<ApiResponse<Review[]>> {
    return httpClient.get<Review[]>("/reviews", { params: params as Record<string, unknown> });
}

export async function createReview(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    return httpClient.post<Review>("/reviews", payload);
}

export async function updateReview(id: string, payload: Partial<CreateReviewPayload> & { status?: string }): Promise<ApiResponse<Review>> {
    return httpClient.patch<Review>(`/reviews/${id}`, payload);
}

export async function deleteReview(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/reviews/${id}`);
}

export async function toggleReviewLike(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.post<{ liked: boolean }>(`/reviews/${id}/like`, {});
}
