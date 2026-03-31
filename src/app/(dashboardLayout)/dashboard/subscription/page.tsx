import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMySubscription, getSubscriptionPlans, verifySubscriptionCheckout } from "@/services/subscription.services";
import { Check, CreditCard } from "lucide-react";
import SubscribeButton from "./SubscribeButton";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

export const dynamic = "force-dynamic";

interface SubscriptionPageProps {
    searchParams: Promise<{ success?: string; canceled?: string; session_id?: string }>;
}

export default async function SubscriptionPage({ searchParams }: SubscriptionPageProps) {
    const query = await searchParams;
    const checkoutSessionId = query.session_id;

    if (query.success === "true" && checkoutSessionId) {
        await verifySubscriptionCheckout(checkoutSessionId).catch(() => null);
    }

    let subscription: Awaited<ReturnType<typeof getMySubscription>>["data"] | null = null;
    let plans: Awaited<ReturnType<typeof getSubscriptionPlans>>["data"] = [];

    try {
        const res = await getMySubscription();
        subscription = res.data;
    } catch { /* not subscribed */ }

    try {
        const res = await getSubscriptionPlans();
        plans = (res.data ?? []).filter(
            (plan): plan is typeof plan & { plan: "MONTHLY" | "YEARLY" } =>
                (plan.plan === "MONTHLY" || plan.plan === "YEARLY") && plan.isActive !== false,
        );
    } catch { /* fallback empty */ }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="size-6" /> Subscription
                </h1>
                <p className="text-muted-foreground">Manage your CineTube subscription</p>
                {query.success === "true" && (
                    <p className="text-sm text-green-600 mt-2">Payment successful. Your subscription access is now active.</p>
                )}
                {query.canceled === "true" && (
                    <p className="text-sm text-amber-600 mt-2">Checkout was canceled.</p>
                )}
            </div>

            {subscription && subscription.status === "ACTIVE" && (
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Current Plan: {subscription.plan}</span>
                            <Badge>{subscription.status}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>Started: {new Date(subscription.startDate).toLocaleDateString()}</p>
                        <p>Renews: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A"}</p>
                        {subscription.amount > 0 && <p>Amount: ${subscription.amount}</p>}
                    </CardContent>
                    <CardFooter>
                        <CancelSubscriptionButton />
                    </CardFooter>
                </Card>
            )}

            {(!subscription || subscription.status !== "ACTIVE") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map((plan) => {
                        const paidPlan: "MONTHLY" | "YEARLY" = plan.plan === "YEARLY" ? "YEARLY" : "MONTHLY";

                        return (
                            <Card key={plan.plan}>
                                <CardHeader className="text-center">
                                    <CardTitle>{plan.label ?? plan.plan}</CardTitle>
                                    <div>
                                        <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
                                        <span className="text-muted-foreground text-sm ml-1">/ {plan.duration}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {plan.features.map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm">
                                            <Check className="size-4 text-green-500" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <SubscribeButton plan={paidPlan} label={`Subscribe ${plan.label ?? plan.plan}`} />
                                </CardFooter>
                            </Card>
                        );
                    })}
                    {plans.length === 0 && (
                        <Card className="md:col-span-2">
                            <CardContent className="pt-6 text-sm text-muted-foreground">
                                Subscription plans are temporarily unavailable.
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
