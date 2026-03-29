"use server";

import { setCookie } from "@/lib/cookieUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!BASE_API_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function storeTokensFromSetCookieHeaders(headers: Headers): Promise<void> {
    const tokenNames = ["accessToken", "refreshToken", "better-auth.session_token"];
    // Node 18+ fetch supports getSetCookie() returning an array
    const setCookieHeaders: string[] = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
    for (const cookieStr of setCookieHeaders) {
        const eqIdx = cookieStr.indexOf("=");
        if (eqIdx === -1) continue;
        const name = cookieStr.substring(0, eqIdx).trim();
        const rest = cookieStr.substring(eqIdx + 1);
        const value = rest.split(";")[0].trim();
        if (!tokenNames.includes(name)) continue;
        const maxAge = name === "better-auth.session_token" ? 60 * 60 * 24 : 60 * 60;
        await setCookie(name, value, maxAge);
    }
}

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,
            },
        });

        if (!res.ok) {
            return false;
        }

        await storeTokensFromSetCookieHeaders(res.headers);
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken ?? ""}`,
            },
        });

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function loginWithCredentials(email: string, password: string) {
    const res = await fetch(`${BASE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Login failed");
    }

    await storeTokensFromSetCookieHeaders(res.headers);
    return json.data as { id: string; name: string; email: string; role: string; status: string };
}

export async function registerUser(name: string, email: string, password: string) {
    const res = await fetch(`${BASE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Registration failed");
    }

    return json.data;
}

export async function verifyEmail(email: string, otp: string) {
    const res = await fetch(`${BASE_API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Email verification failed");
    }

    return json;
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${BASE_API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to send reset OTP");
    }

    return json;
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
    const res = await fetch(`${BASE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Password reset failed");
    }

    return json;
}

export async function logoutUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    try {
        await fetch(`${BASE_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken ?? ""}; better-auth.session_token=${sessionToken ?? ""}`,
            },
        });
    } catch (error) {
        console.error("Logout API call failed:", error);
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
}
