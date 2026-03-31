import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Subscription, SubscriptionPlan } from "@/types/subscription.types";

export interface UpdateSubscriptionPlanPayload {
    label?: string;
    price?: number;
    durationDays?: number;
    features?: string[];
    isActive?: boolean;
}

export async function getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return httpClient.get<SubscriptionPlan[]>("/subscriptions/plans");
}

export async function updateSubscriptionPlan(
    plan: "FREE" | "MONTHLY" | "YEARLY",
    payload: UpdateSubscriptionPlanPayload,
): Promise<ApiResponse<SubscriptionPlan>> {
    return httpClient.patch<SubscriptionPlan>(`/subscriptions/plans/${plan}`, payload);
}

export async function getMySubscription(): Promise<ApiResponse<Subscription>> {
    return httpClient.get<Subscription>("/subscriptions/me");
}

export async function createCheckoutSession(plan: "MONTHLY" | "YEARLY"): Promise<ApiResponse<{ checkoutUrl: string }>> {
    return httpClient.post<{ checkoutUrl: string }>("/subscriptions/checkout", { plan });
}

export async function cancelSubscription(): Promise<ApiResponse<null>> {
    return httpClient.post<null>("/subscriptions/cancel", {});
}
