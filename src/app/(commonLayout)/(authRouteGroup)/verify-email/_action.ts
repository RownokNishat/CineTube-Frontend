/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { verifyEmail } from "@/services/auth.services";
import { ApiErrorResponse } from "@/types/api.types";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (payload: IVerifyEmailPayload): Promise<{ success: true } | ApiErrorResponse> => {
    const parsedPayload = verifyEmailZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        await verifyEmail(parsedPayload.data.email, parsedPayload.data.otp);
        redirect("/login");
    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Email verification failed",
        };
    }
};
