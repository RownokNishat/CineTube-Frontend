import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export async function changeMyPassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return httpClient.post<null>("/auth/change-password", {
        currentPassword,
        newPassword,
    });
}

export async function adminResetPassword(userId: string, newPassword: string): Promise<ApiResponse<null>> {
    return httpClient.post<null>("/auth/admin/reset-password", {
        userId,
        newPassword,
    });
}
