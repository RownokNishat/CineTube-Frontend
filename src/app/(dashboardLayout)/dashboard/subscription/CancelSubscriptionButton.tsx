"use client";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/services/subscription.services";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CancelSubscriptionButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription?")) return;
        setLoading(true);
        try {
            await cancelSubscription();
            toast.success("Subscription cancelled");
            router.refresh();
        } catch {
            toast.error("Failed to cancel subscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="destructive" onClick={handleCancel} disabled={loading} className="w-full">
            {loading ? "Cancelling..." : "Cancel Subscription"}
        </Button>
    );
};

export default CancelSubscriptionButton;
