import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Media, MediaQueryParams } from "@/types/media.types";

export async function getMediaList(params?: MediaQueryParams): Promise<ApiResponse<Media[]>> {
    return httpClient.get<Media[]>("/media", { params: params as Record<string, unknown> });
}

export async function getMediaById(id: string): Promise<ApiResponse<Media>> {
    return httpClient.get<Media>(`/media/${id}`);
}

export async function createMedia(formData: FormData): Promise<ApiResponse<Media>> {
    return httpClient.post<Media>("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateMedia(id: string, formData: FormData): Promise<ApiResponse<Media>> {
    return httpClient.patch<Media>(`/media/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function deleteMedia(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/media/${id}`);
}

// Premium Media Purchase Endpoints
export async function createMediaCheckoutSession(mediaId: string): Promise<ApiResponse<{ checkoutUrl: string; sessionId: string }>> {
    return httpClient.post<{ checkoutUrl: string; sessionId: string }>("/media/purchase/checkout", {
        mediaId,
    });
}

export async function getUserMediaAccess(mediaId: string): Promise<ApiResponse<{ hasAccess: boolean }>> {
    return httpClient.get<{ hasAccess: boolean }>(`/media/${mediaId}/access`);
}

export async function getPurchasedMedia(): Promise<ApiResponse<Media[]>> {
    return httpClient.get<Media[]>("/media/purchases/my-purchases");
}

export async function verifyMediaPurchase(sessionId: string): Promise<ApiResponse<{ hasAccess: boolean; mediaId?: string; reason?: string }>> {
    return httpClient.get<{ hasAccess: boolean; mediaId?: string; reason?: string }>("/media/purchases/verify", {
        params: { sessionId },
    });
}
