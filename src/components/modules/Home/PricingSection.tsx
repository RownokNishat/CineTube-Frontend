import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Access free movies & series",
        features: [
            "Browse free content",
            "Rate & review movies",
            "Add to watchlist",
            "Comment on reviews",
        ],
        cta: "Get Started",
        href: "/register",
        variant: "outline" as const,
    },
    {
        name: "Monthly",
        price: "$9.99",
        period: "per month",
        description: "Full access to all premium content",
        features: [
            "Everything in Free",
            "Unlimited premium content",
            "HD streaming",
            "Cancel anytime",
        ],
        cta: "Subscribe Monthly",
        href: "/dashboard/subscription",
        variant: "default" as const,
        popular: true,
    },
    {
        name: "Yearly",
        price: "$79.99",
        period: "per year",
        description: "Best value — save over 33%",
        features: [
            "Everything in Monthly",
            "2 months free",
            "Priority support",
            "Early access to new titles",
        ],
        cta: "Subscribe Yearly",
        href: "/dashboard/subscription",
        variant: "outline" as const,
    },
];

const PricingSection = () => {
    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
                    <p className="text-muted-foreground">Start free, upgrade anytime</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                                </div>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <div>
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm ml-1">/ {plan.period}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
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
                                <Button asChild variant={plan.variant} className="w-full">
                                    <Link href={plan.href}>{plan.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
