"use client";
import { Button } from "@/components/ui/button";
import { removeFromWatchlist } from "@/services/watchlist.services";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RemoveFromWatchlistButton = ({ mediaId }: { mediaId: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRemove = async () => {
        setLoading(true);
        try {
            await removeFromWatchlist(mediaId);
            toast.success("Removed from watchlist");
            router.refresh();
        } catch {
            toast.error("Failed to remove from watchlist");
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
