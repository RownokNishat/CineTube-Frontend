"use client";
import { Button } from "@/components/ui/button";
import { updateReview, deleteReview } from "@/services/review.services";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewActionButtonsProps {
    reviewId: string;
    currentStatus: string;
}

const ReviewActionButtons = ({ reviewId, currentStatus }: ReviewActionButtonsProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (action: "publish" | "unpublish" | "delete") => {
        if (action === "delete" && !confirm("Delete this review permanently?")) return;
        setLoading(true);
        try {
            if (action === "delete") {
                await deleteReview(reviewId);
                toast.success("Review deleted");
            } else {
                await updateReview(reviewId, { status: action === "publish" ? "PUBLISHED" : "UNPUBLISHED" });
                toast.success(`Review ${action === "publish" ? "published" : "unpublished"}`);
            }
            router.refresh();
        } catch {
            toast.error("Action failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-1">
            {currentStatus !== "PUBLISHED" && (
                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleAction("publish")} disabled={loading} title="Publish">
                    <CheckCircle className="size-4" />
                </Button>
            )}
            {currentStatus === "PUBLISHED" && (
                <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600" onClick={() => handleAction("unpublish")} disabled={loading} title="Unpublish">
                    <XCircle className="size-4" />
                </Button>
            )}
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleAction("delete")} disabled={loading} title="Delete">
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
};

export default ReviewActionButtons;
