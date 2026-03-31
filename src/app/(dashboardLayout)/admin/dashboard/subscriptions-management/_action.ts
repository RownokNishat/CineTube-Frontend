"use server";

import { updateSubscriptionPlan } from "@/services/subscription.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { SubscriptionPlan } from "@/types/subscription.types";

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
        return error.response.data.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};

export const updateSubscriptionPlanAction = async (
    plan: "FREE" | "MONTHLY" | "YEARLY",
    payload: {
        label?: string;
        price?: number;
        durationDays?: number;
        features?: string[];
        isActive?: boolean;
    },
): Promise<ApiResponse<SubscriptionPlan> | ApiErrorResponse> => {
    try {
        return await updateSubscriptionPlan(plan, payload);
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to update subscription plan"),
        };
    }
};