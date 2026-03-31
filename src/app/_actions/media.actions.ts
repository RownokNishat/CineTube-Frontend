"use server"

import { createMediaCheckoutSession, getPurchasedMedia, getUserMediaAccess, verifyMediaPurchase } from "@/services/media.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type Media } from "@/types/media.types"

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

export const createMediaCheckoutSessionAction = async (
    mediaId: string,
    purchaseType: "PURCHASE" | "RENTAL" = "PURCHASE",
    rentalDays?: number
): Promise<ApiResponse<{ checkoutUrl: string; sessionId: string }> | ApiErrorResponse> => {
    try {
        return await createMediaCheckoutSession(mediaId, purchaseType, rentalDays)
    } catch (error: unknown) {
        const statusCode =
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "status" in error.response &&
            typeof error.response.status === "number"
                ? error.response.status
                : undefined

        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create checkout session"),
            statusCode,
        }
    }
}

export const checkUserMediaAccessAction = async (
    mediaId: string
): Promise<ApiResponse<{ hasAccess: boolean }> | ApiErrorResponse> => {
    try {
        return await getUserMediaAccess(mediaId)
    } catch (error: unknown) {
        return { success: false, message: getActionErrorMessage(error, "Failed to check media access") }
    }
}

export const verifyMediaPurchaseAction = async (
    sessionId: string
): Promise<ApiResponse<{ hasAccess: boolean; mediaId?: string; reason?: string; purchase?: { media?: { id?: string } } }> | ApiErrorResponse> => {
    try {
        return await verifyMediaPurchase(sessionId)
    } catch (error: unknown) {
        const statusCode =
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "status" in error.response &&
            typeof error.response.status === "number"
                ? error.response.status
                : undefined

        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to verify media purchase"),
            statusCode,
        }
    }
}

export const getPurchasedMediaAction = async (): Promise<ApiResponse<Media[]> | ApiErrorResponse> => {
    try {
        return await getPurchasedMedia()
    } catch (error: unknown) {
        const statusCode =
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "status" in error.response &&
            typeof error.response.status === "number"
                ? error.response.status
                : undefined

        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to fetch purchased media"),
            statusCode,
        }
    }
}
