import ReviewSection from "@/components/modules/Media/ReviewSection";
import WatchlistButton from "@/components/modules/Media/WatchlistButton";
import PurchaseButton from "@/components/modules/Media/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaById, getUserMediaAccess, verifyMediaPurchase } from "@/services/media.services";
import { getAdminMediaReviews, getReviews } from "@/services/review.services";
import { getWatchlist } from "@/services/watchlist.services";
import { getUserInfo } from "@/services/auth.services";
import { Calendar, Clock, ExternalLink, Film, Star, Tv, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MediaDetailPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ session_id?: string; purchase_session?: string }>;
}

export default async function MediaDetailPage({ params, searchParams }: MediaDetailPageProps) {
    const { id } = await params;
    const query = await searchParams;
    const purchaseSessionId = query.session_id || query.purchase_session;

    const [mediaRes, user] = await Promise.all([
        getMediaById(id).catch(() => null),
        getUserInfo().catch(() => null),
    ]);

    if (!mediaRes) notFound();

    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    const reviewsRes = await (isAdmin
        ? getAdminMediaReviews(id, { limit: 50 }).catch(() => ({ data: [] }))
        : getReviews({ mediaId: id, limit: 20 }).catch(() => ({ data: [] }))
    );

    const media = mediaRes.data;
    const reviews = reviewsRes.data ?? [];

    // Check if media is in user's watchlist
    let isInWatchlist = false;
    let hasMediaAccess = media.pricingType === "FREE"; // Free media is always accessible
    
    if (user) {
        try {
            const watchlistRes = await getWatchlist();
            isInWatchlist = (watchlistRes.data ?? []).some((item) => item.mediaId === id);
        } catch { /* ignore */ }

    }

    // Check if user has access to premium media independent of user-info request.
    if (media.pricingType === "PREMIUM") {
        try {
            const accessRes = await getUserMediaAccess(id);
            if (accessRes.success && "data" in accessRes) {
                hasMediaAccess = accessRes.data.hasAccess;
            }
        } catch { /* ignore */ }

        // Fallback right after Stripe redirect: verify by checkout session id.
        if (!hasMediaAccess && purchaseSessionId) {
            try {
                const verifyRes = await verifyMediaPurchase(purchaseSessionId);
                if (
                    verifyRes.success &&
                    "data" in verifyRes &&
                    verifyRes.data.hasAccess &&
                    (!verifyRes.data.mediaId || verifyRes.data.mediaId === id)
                ) {
                    hasMediaAccess = true;
                }
            } catch { /* ignore */ }
        }
    }

    const avgRating = media.averageRating ?? (reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null);

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
            {/* Hero */}
            <div className="flex flex-col sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:flex-row">
                <div className="shrink-0 mx-auto sm:mx-0">
                    <div className="relative aspect-2/3 w-32 sm:w-40 md:w-48 lg:w-64 overflow-hidden rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl">
                        {media.posterUrl ? (
                            <Image src={media.posterUrl} alt={media.title} fill className="object-cover" sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 256px" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Film className="size-8 sm:size-10 md:size-12 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-3 sm:space-y-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant={media.mediaType === "MOVIE" ? "default" : "secondary"} className="gap-1">
                                {media.mediaType === "MOVIE" ? <Film className="size-3" /> : <Tv className="size-3" />}
                                {media.mediaType}
                            </Badge>
                            <Badge variant={media.pricingType === "FREE" ? "outline" : "default"}>
                                {media.pricingType}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">{media.title}</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" /> {media.releaseYear}
                        </span>
                        {media.streamingPlatform && (
                            <span className="flex items-center gap-1">
                                <Clock className="size-4" /> {media.streamingPlatform}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Users className="size-4" /> {reviews.length} reviews
                        </span>
                    </div>

                    {avgRating !== null && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
                                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">/10</span>
                            </div>
                        </div>
                    )}

                    <p className="text-muted-foreground leading-relaxed">{media.synopsis}</p>

                    <div className="space-y-2 text-sm">
                        {media.director && (
                            <p><span className="font-medium">Director:</span> {media.director}</p>
                        )}
                        {media.cast?.length > 0 && (
                            <p><span className="font-medium">Cast:</span> {media.cast.join(", ")}</p>
                        )}
                    </div>

                    {media.genres?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {media.genres.map((g) => (
                                <Badge key={g.id} variant="outline">{g.name}</Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <WatchlistButton mediaId={id} isInWatchlist={isInWatchlist} isLoggedIn={!!user} />
                        
                        {/* Premium Media Purchase or Watch Button */}
                        {media.pricingType === "PREMIUM" && !hasMediaAccess ? (
                            <PurchaseButton mediaId={id} mediaTitle={media.title} isLoggedIn={!!user} price={9.99} />
                        ) : media.streamingLink ? (
                            <Button variant="outline" asChild className="gap-2">
                                <a href={media.streamingLink} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-4" /> Watch Now
                                </a>
                            </Button>
                        ) : null}

                        {media.trailerUrl && (
                            <Button variant="ghost" asChild className="gap-2">
                                <a href={media.trailerUrl} target="_blank" rel="noopener noreferrer">
                                    Trailer
                                </a>
                            </Button>
                        )}
                    </div>

                    {!user && (
                        <p className="text-sm text-muted-foreground">
                            <Link href="/login" className="text-primary underline">Sign in</Link> to {media.pricingType === "PREMIUM" ? "purchase and" : ""} add to watchlist and write reviews.
                        </p>
                    )}
                </div>
            </div>

            {/* Reviews */}
            <ReviewSection
                mediaId={id}
                initialReviews={reviews}
                isLoggedIn={!!user}
                userId={user?.id}
                isAdmin={isAdmin}
            />
        </div>
    );
}
