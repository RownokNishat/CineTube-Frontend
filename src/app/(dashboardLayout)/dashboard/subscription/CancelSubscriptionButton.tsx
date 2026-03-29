"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cancelSubscriptionAction } from "./_action";
import { useState } from "react";
import { toast } from "sonner";

const CancelSubscriptionButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription?")) return;
        setLoading(true);
        try {
            const result = await cancelSubscriptionAction();
            if (!result.success) {
                toast.error(result.message || "Failed to cancel subscription");
                return;
            }
            toast.success("Subscription cancelled");
            router.refresh();
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
