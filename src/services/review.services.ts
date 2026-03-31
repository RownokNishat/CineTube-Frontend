import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { CreateReviewPayload, Review, ReviewStats } from "@/types/review.types";

export interface ReviewQueryParams {
    mediaId?: string;
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: "PENDING" | "PUBLISHED" | "UNPUBLISHED";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export async function getReviews(params?: ReviewQueryParams): Promise<ApiResponse<Review[]>> {
    if (params?.mediaId) {
        const { mediaId, sortBy, sortOrder, ...rest } = params;

        const mediaScopedParams: Record<string, unknown> = {
            ...rest,
        };

        if (sortBy) {
            mediaScopedParams.sort = `${sortOrder === "asc" ? "" : "-"}${sortBy}`;
        }

        return httpClient.get<Review[]>(`/reviews/media/${mediaId}`, { params: mediaScopedParams });
    }

    return httpClient.get<Review[]>("/reviews", { params: params as Record<string, unknown> });
}

export async function getAdminMediaReviews(mediaId: string, params?: Omit<ReviewQueryParams, "mediaId">): Promise<ApiResponse<Review[]>> {
    const queryParams = params ? { ...params } as Record<string, unknown> : {};

    if (params?.sortBy) {
        queryParams.sort = `${params.sortOrder === "asc" ? "" : "-"}${params.sortBy}`;
        delete queryParams.sortBy;
        delete queryParams.sortOrder;
    }

    return httpClient.get<Review[]>(`/reviews/admin/media/${mediaId}`, { params: queryParams });
}

export async function createReview(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    const { mediaId, ...data } = payload;
    return httpClient.post<Review>(`/reviews/media/${mediaId}`, data);
}

export async function getReviewById(id: string): Promise<ApiResponse<Review>> {
    return httpClient.get<Review>(`/reviews/${id}`);
}

export async function updateReview(id: string, payload: Partial<CreateReviewPayload> & { status?: string }): Promise<ApiResponse<Review>> {
    return httpClient.patch<Review>(`/reviews/${id}`, payload);
}

export async function deleteReview(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/reviews/${id}`);
}

export async function approveReview(id: string): Promise<ApiResponse<Review>> {
    return httpClient.patch<Review>(`/reviews/${id}/approve`, {});
}

export async function unpublishReview(id: string): Promise<ApiResponse<Review>> {
    return httpClient.patch<Review>(`/reviews/${id}/unpublish`, {});
}

export async function adminDeleteReview(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/reviews/${id}/admin`);
}

export async function getMediaReviewStats(mediaId: string): Promise<ApiResponse<ReviewStats>> {
    return httpClient.get<ReviewStats>(`/reviews/media/${mediaId}/stats`);
}

export async function likeReview(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.post<{ liked: boolean }>(`/reviews/${id}/like`, {});
}

export async function unlikeReview(id: string): Promise<ApiResponse<{ liked: boolean }>> {
    return httpClient.delete<{ liked: boolean }>(`/reviews/${id}/like`);
}
