import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { storeTokensFromSetCookieHeaders } from "./auth.services";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function changeMyPassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await fetch(`${BASE_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken ?? ""}; better-auth.session_token=${sessionToken ?? ""}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to change password");
    }

    await storeTokensFromSetCookieHeaders(res.headers);
    return json;
}

export async function adminResetPassword(userId: string, newPassword: string): Promise<ApiResponse<null>> {
    return httpClient.post<null>("/auth/admin/reset-password", {
        userId,
        newPassword,
    });
}
