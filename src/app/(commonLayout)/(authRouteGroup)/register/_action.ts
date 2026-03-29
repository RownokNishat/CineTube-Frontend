/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { registerUser } from "@/services/auth.services";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload): Promise<{ success: true } | ApiErrorResponse> => {
    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        const { name, email, password } = parsedPayload.data;
        await registerUser(name, email, password);
        redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Registration failed",
        };
    }
};
