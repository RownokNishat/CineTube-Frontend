"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createCheckoutSessionAction } from "./_action";

interface SubscribeButtonProps {
    plan: "MONTHLY" | "YEARLY";
    label: string;
}

const SubscribeButton = ({ plan, label }: SubscribeButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const result = await createCheckoutSessionAction(plan);
            if (!result.success) {
                toast.error(result.message || "Failed to start checkout");
                setLoading(false);
                return;
            }
            if (result.data?.checkoutUrl) {
                window.location.href = result.data.checkoutUrl;
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
