"use server"

import { adminResetPassword, changeMyPassword } from "@/services/account.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation"

const getActionErrorMessage = (error: unknown, fallback: string): string => {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
    ) {
        return error.response.data.message
    }
    if (error instanceof Error) return error.message
    return fallback
}

export const changeMyPasswordAction = async (
    payload: IChangePasswordPayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    const parsedPayload = changePasswordZodSchema.safeParse(payload)

    if (!parsedPayload.success) {
        return { success: false, message: parsedPayload.error.issues[0]?.message || "Invalid input" }
    }

    try {
        return await changeMyPassword(parsedPayload.data.currentPassword, parsedPayload.data.newPassword)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to change password") }
    }
}

export const adminResetPasswordAction = async (
    userId: string,
    newPassword: string
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    if (!userId || !newPassword) {
        return { success: false, message: "User ID and new password are required" }
    }

    try {
        return await adminResetPassword(userId, newPassword)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to reset user password") }
    }
}
