import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cancelSubscription, createCheckoutSession, getMySubscription } from "@/services/subscription.services";
import { Check, CreditCard } from "lucide-react";
import SubscribeButton from "./SubscribeButton";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

export const dynamic = "force-dynamic";

const plans = [
    {
        key: "MONTHLY" as const,
        name: "Monthly",
        price: "$9.99",
        period: "per month",
        features: ["All premium content", "HD streaming", "Cancel anytime"],
    },
    {
        key: "YEARLY" as const,
        name: "Yearly",
        price: "$79.99",
        period: "per year",
        features: ["All premium content", "HD streaming", "2 months free", "Priority support"],
    },
];

export default async function SubscriptionPage() {
    let subscription: Awaited<ReturnType<typeof getMySubscription>>["data"] | null = null;
    try {
        const res = await getMySubscription();
        subscription = res.data;
    } catch { /* not subscribed */ }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="size-6" /> Subscription
                </h1>
                <p className="text-muted-foreground">Manage your CineTube subscription</p>
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
                        <p>Renews: {new Date(subscription.endDate).toLocaleDateString()}</p>
                        {subscription.amount > 0 && <p>Amount: ${subscription.amount}</p>}
                    </CardContent>
                    <CardFooter>
                        <CancelSubscriptionButton />
                    </CardFooter>
                </Card>
            )}

            {(!subscription || subscription.status !== "ACTIVE") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                        <Card key={plan.key}>
                            <CardHeader className="text-center">
                                <CardTitle>{plan.name}</CardTitle>
                                <div>
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm ml-1">/ {plan.period}</span>
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
                                <SubscribeButton plan={plan.key} label={`Subscribe ${plan.name}`} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
