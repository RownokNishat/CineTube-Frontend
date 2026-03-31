import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { SubscriptionPlan } from "@/types/subscription.types";
import { Check } from "lucide-react";
import Link from "next/link";

const fallbackPlans = [
    {
        plan: "FREE" as const,
        label: "Free",
        price: 0,
        duration: "forever",
        features: [
            "Browse free content",
            "Rate & review movies",
            "Add to watchlist",
            "Comment on reviews",
        ],
        isActive: true,
    },
    {
        plan: "MONTHLY" as const,
        label: "Monthly",
        price: 9.99,
        duration: "30 days",
        features: [
            "Everything in Free",
            "Unlimited premium content",
            "HD streaming",
            "Cancel anytime",
        ],
        isActive: true,
        popular: true,
    },
    {
        plan: "YEARLY" as const,
        label: "Yearly",
        price: 79.99,
        duration: "365 days",
        features: [
            "Everything in Monthly",
            "2 months free",
            "Priority support",
            "Early access to new titles",
        ],
        isActive: true,
    },
];

const getPlanDescription = (plan: SubscriptionPlan) => {
    if (plan.plan === "FREE") return "Access free movies & series";
    if (plan.plan === "MONTHLY") return "Flexible premium access billed monthly";
    return "Best long-term value for premium access";
};

const getPlanCta = (plan: SubscriptionPlan) => {
    if (plan.plan === "FREE") {
        return {
            label: "Get Started",
            href: "/register",
            variant: "outline" as const,
        };
    }

    return {
        label: `Subscribe ${plan.label ?? plan.plan}`,
        href: "/dashboard/subscription",
        variant: plan.plan === "MONTHLY" ? "default" as const : "outline" as const,
    };
};

const PricingSection = async () => {
    let plans: SubscriptionPlan[] = fallbackPlans;

    try {
        const res = await getSubscriptionPlans();
        const livePlans = (res.data ?? []).filter((plan) => plan.isActive !== false);
        if (livePlans.length > 0) {
            plans = livePlans;
        }
    } catch {
        plans = fallbackPlans;
    }

    const orderedPlans = ["FREE", "MONTHLY", "YEARLY"]
        .map((planType) => plans.find((plan) => plan.plan === planType))
        .filter((plan): plan is SubscriptionPlan => Boolean(plan));

    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
                    <p className="text-muted-foreground">Start free, upgrade anytime</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {orderedPlans.map((plan) => {
                        const cta = getPlanCta(plan);
                        const isPopular = plan.plan === "MONTHLY";

                        return (
                        <Card key={plan.plan} className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}>
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                                </div>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl">{plan.label ?? plan.plan}</CardTitle>
                                <div>
                                    <span className="text-4xl font-bold">${plan.price.toFixed(2)}</span>
                                    <span className="text-muted-foreground text-sm ml-1">/ {plan.duration}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{getPlanDescription(plan)}</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm">
                                        <Check className="size-4 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant={cta.variant} className="w-full">
                                    <Link href={cta.href}>{cta.label}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
