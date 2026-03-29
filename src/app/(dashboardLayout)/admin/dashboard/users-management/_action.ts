"use server"

import { deleteUser } from "@/services/user.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"

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

export const deleteUserAction = async (
    id: string
): Promise<ApiResponse<null> | ApiErrorResponse> => {
    try {
        return await deleteUser(id)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to delete user") }
    }
}
