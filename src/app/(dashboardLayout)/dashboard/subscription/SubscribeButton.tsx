"use client";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/services/subscription.services";
import { useState } from "react";
import { toast } from "sonner";

interface SubscribeButtonProps {
    plan: "MONTHLY" | "YEARLY";
    label: string;
}

const SubscribeButton = ({ plan, label }: SubscribeButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await createCheckoutSession(plan);
            if (res.data?.checkoutUrl) {
                window.location.href = res.data.checkoutUrl;
            }
        } catch {
            toast.error("Failed to start checkout");
            setLoading(false);
        }
    };

    return (
        <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
            {loading ? "Redirecting..." : label}
        </Button>
    );
};

export default SubscribeButton;
