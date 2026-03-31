import SubscriptionPlanEditor from "./SubscriptionPlanEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SubscriptionsManagementPageProps {
    searchParams: Promise<{ searchTerm?: string }>;
}

export default async function SubscriptionsManagementPage({ searchParams }: SubscriptionsManagementPageProps) {
    const params = await searchParams;
    const searchTerm = params.searchTerm?.trim().toLowerCase() ?? "";

    let plans: Awaited<ReturnType<typeof getSubscriptionPlans>>["data"] = [];
    try {
        const response = await getSubscriptionPlans();
        plans = response.data ?? [];
    } catch {
        plans = [];
    }

    const filteredPlans = plans.filter((plan) => {
        if (!searchTerm) {
            return true;
        }

        const haystack = [plan.plan, plan.label, ...(plan.features ?? [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(searchTerm);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <CreditCard className="size-6" /> Subscription Management
                    </h1>
                    <p className="text-muted-foreground">
                        Update subscription price, duration, availability, and benefits.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/dashboard/payments-management">Back to Payments</Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <form className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            type="search"
                            name="searchTerm"
                            defaultValue={params.searchTerm ?? ""}
                            placeholder="Search plans or benefits"
                            className="sm:max-w-sm"
                        />
                        <div className="flex gap-2">
                            <Button type="submit">Search</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/dashboard/subscriptions-management">Reset</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-2">
                {filteredPlans.map((plan) => (
                    <Card key={plan.plan}>
                        <CardHeader>
                            <CardTitle>{plan.label ?? plan.plan}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SubscriptionPlanEditor plan={plan} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPlans.length === 0 && (
                <Card>
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        No subscription plans matched your search.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}