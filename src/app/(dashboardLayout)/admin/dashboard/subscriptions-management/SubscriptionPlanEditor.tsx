"use client";

import { updateSubscriptionPlanAction } from "./_action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubscriptionPlan } from "@/types/subscription.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SubscriptionPlanEditorProps {
    plan: SubscriptionPlan;
}

export default function SubscriptionPlanEditor({ plan }: SubscriptionPlanEditorProps) {
    const router = useRouter();
    const [label, setLabel] = useState(plan.label ?? plan.plan);
    const [price, setPrice] = useState(String(plan.price ?? 0));
    const [durationDays, setDurationDays] = useState(String(plan.durationDays ?? 0));
    const [features, setFeatures] = useState((plan.features ?? []).join("\n"));
    const [isActive, setIsActive] = useState(plan.isActive ?? true);
    const [saving, setSaving] = useState(false);

    const isFreePlan = plan.plan === "FREE";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);

        const parsedPrice = Number(price);
        const parsedDurationDays = Number(durationDays);
        const parsedFeatures = features
            .split("\n")
            .map((feature) => feature.trim())
            .filter(Boolean);

        const result = await updateSubscriptionPlanAction(plan.plan, {
            label,
            price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
            durationDays: Number.isFinite(parsedDurationDays) ? parsedDurationDays : 0,
            features: parsedFeatures,
            isActive,
        });

        setSaving(false);

        if (!result.success) {
            toast.error(result.message || "Failed to update subscription plan");
            return;
        }

        toast.success(`${plan.plan} plan updated`);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Label</label>
                    <Input value={label} onChange={(event) => setLabel(event.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        disabled={isFreePlan}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Duration in Days</label>
                    <Input
                        type="number"
                        min={0}
                        step="1"
                        value={durationDays}
                        onChange={(event) => setDurationDays(event.target.value)}
                        disabled={isFreePlan}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Availability</label>
                    <label className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) => setIsActive(event.target.checked)}
                        />
                        <span>{isActive ? "Active" : "Inactive"}</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Benefits</label>
                <textarea
                    value={features}
                    onChange={(event) => setFeatures(event.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="One benefit per line"
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Plan"}
                </Button>
            </div>
        </form>
    );
}