"use server"

import { updateMyProfile, updateUserProfileById } from "@/services/user.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { IUpdateProfilePayload, updateProfileZodSchema } from "@/zod/auth.validation"

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

export const updateMyProfileAction = async (
    payload: IUpdateProfilePayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    const parsedPayload = updateProfileZodSchema.safeParse(payload)

    if (!parsedPayload.success) {
        return { success: false, message: parsedPayload.error.issues[0]?.message || "Invalid input" }
    }

    try {
        return await updateMyProfile({
            ...parsedPayload.data,
            image: parsedPayload.data.image || null,
        })
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to update profile") }
    }
}

export const updateUserProfileByIdAction = async (
    userId: string,
    payload: IUpdateProfilePayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    const parsedPayload = updateProfileZodSchema.safeParse(payload)

    if (!parsedPayload.success) {
        return { success: false, message: parsedPayload.error.issues[0]?.message || "Invalid input" }
    }

    try {
        return await updateUserProfileById(userId, {
            ...parsedPayload.data,
            image: parsedPayload.data.image || null,
        })
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to update user profile") }
    }
}
