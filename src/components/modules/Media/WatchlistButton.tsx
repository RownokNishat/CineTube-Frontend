"use client";
import { Button } from "@/components/ui/button";
import { addToWatchlist, removeFromWatchlist } from "@/services/watchlist.services";
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
            if (inWatchlist) {
                await removeFromWatchlist(mediaId);
                setInWatchlist(false);
                toast.success("Removed from watchlist");
            } else {
                await addToWatchlist(mediaId);
                setInWatchlist(true);
                toast.success("Added to watchlist");
            }
        } catch {
            toast.error("Failed to update watchlist");
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
