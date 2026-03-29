"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteReviewAction, updateReviewAction } from "./_action";

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
            const result = action === "delete"
                ? await deleteReviewAction(reviewId)
                : await updateReviewAction(reviewId, { status: action === "publish" ? "PUBLISHED" : "UNPUBLISHED" });

            if (!result.success) {
                toast.error(result.message || "Action failed");
            } else {
                toast.success(action === "delete" ? "Review deleted" : `Review ${action === "publish" ? "published" : "unpublished"}`);
                router.refresh();
            }
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
