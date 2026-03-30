import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    needPasswordChange: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UsersQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: string;
    status?: string;
}

export interface UpdateMyProfilePayload {
    name: string;
    image?: string | null;
}

export async function getAllUsers(params?: UsersQueryParams): Promise<ApiResponse<UserProfile[]>> {
    return httpClient.get<UserProfile[]>("/users", { params: params as Record<string, unknown> });
}

export async function getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    return httpClient.get<UserProfile>(`/users/${id}`);
}

export async function getMyProfile(): Promise<ApiResponse<UserProfile>> {
    return httpClient.get<UserProfile>("/users/me");
}

export async function updateMyProfile(payload: UpdateMyProfilePayload): Promise<ApiResponse<UserProfile>> {
    return httpClient.patch<UserProfile>("/users/me", payload);
}

export async function updateUserProfileById(id: string, payload: UpdateMyProfilePayload): Promise<ApiResponse<UserProfile>> {
    return httpClient.patch<UserProfile>(`/users/${id}/profile`, payload);
}

export async function updateUser(id: string, formData: FormData): Promise<ApiResponse<UserProfile>> {
    return httpClient.patch<UserProfile>(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/users/${id}`);
}
