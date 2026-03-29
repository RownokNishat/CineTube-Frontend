"use client";
import { addToWatchlistAction, removeFromWatchlistAction } from "@/app/_actions/watchlist.actions";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WatchlistButtonProps {
    mediaId: string;
    isInWatchlist: boolean;
    isLoggedIn: boolean;
}

const WatchlistButton = ({ mediaId, isInWatchlist: initial, isLoggedIn }: WatchlistButtonProps) => {
    const [inWatchlist, setInWatchlist] = useState(initial);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to manage your watchlist");
            return;
        }
        setLoading(true);
        try {
            const result = inWatchlist
                ? await removeFromWatchlistAction(mediaId)
                : await addToWatchlistAction(mediaId);
            if (!result.success) {
                toast.error(result.message || "Failed to update watchlist");
            } else {
                setInWatchlist(!inWatchlist);
                toast.success(inWatchlist ? "Removed from watchlist" : "Added to watchlist");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant={inWatchlist ? "default" : "outline"} onClick={handleToggle} disabled={loading} className="gap-2">
            {inWatchlist ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
    );
};

export default WatchlistButton;
