"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeFromWatchlistAction } from "@/app/_actions/watchlist.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RemoveFromWatchlistButton = ({ mediaId }: { mediaId: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRemove = async () => {
        setLoading(true);
        try {
            const result = await removeFromWatchlistAction(mediaId);
            if (!result.success) {
                toast.error(result.message || "Failed to remove from watchlist");
                return;
            }
            toast.success("Removed from watchlist");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" className="w-full gap-2 text-destructive hover:text-destructive" onClick={handleRemove} disabled={loading}>
            <Trash2 className="size-3" />
            {loading ? "Removing..." : "Remove"}
        </Button>
    );
};

export default RemoveFromWatchlistButton;
