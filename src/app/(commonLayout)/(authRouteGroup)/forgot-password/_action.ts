/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { forgotPassword } from "@/services/auth.services";
import { ApiErrorResponse } from "@/types/api.types";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";

export const forgotPasswordAction = async (payload: IForgotPasswordPayload): Promise<{ success: true; message: string } | ApiErrorResponse> => {
    const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return { success: false, message: firstError };
    }

    try {
        await forgotPassword(parsedPayload.data.email);
        return { success: true, message: "OTP sent to your email. Please check your inbox." };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to send reset OTP",
        };
    }
};
