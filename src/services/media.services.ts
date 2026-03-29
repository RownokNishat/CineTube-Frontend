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
