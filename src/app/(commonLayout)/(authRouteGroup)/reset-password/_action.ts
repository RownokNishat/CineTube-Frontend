/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { resetPassword } from "@/services/auth.services";
import { ApiErrorResponse } from "@/types/api.types";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (payload: IResetPasswordPayload): Promise<{ success: true } | ApiErrorResponse> => {
    const parsedPayload = resetPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        await resetPassword(parsedPayload.data.email, parsedPayload.data.otp, parsedPayload.data.newPassword);
        redirect("/login");
    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            message: error?.message || "Password reset failed",
        };
    }
};
