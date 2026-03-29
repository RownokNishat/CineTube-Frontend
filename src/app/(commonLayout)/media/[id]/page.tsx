import ReviewSection from "@/components/modules/Media/ReviewSection";
import WatchlistButton from "@/components/modules/Media/WatchlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaById } from "@/services/media.services";
import { getReviews } from "@/services/review.services";
import { getWatchlist } from "@/services/watchlist.services";
import { getUserInfo } from "@/services/auth.services";
import { Calendar, Clock, ExternalLink, Film, Star, Tv, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MediaDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
    const { id } = await params;

    const [mediaRes, reviewsRes, user] = await Promise.all([
        getMediaById(id).catch(() => null),
        getReviews({ mediaId: id, limit: 20 }).catch(() => ({ data: [] })),
        getUserInfo().catch(() => null),
    ]);

    if (!mediaRes) notFound();

    const media = mediaRes.data;
    const reviews = reviewsRes.data ?? [];

    // Check if media is in user's watchlist
    let isInWatchlist = false;
    if (user) {
        try {
            const watchlistRes = await getWatchlist();
            isInWatchlist = (watchlistRes.data ?? []).some((item) => item.mediaId === id);
        } catch { /* ignore */ }
    }

    const avgRating = media.averageRating ?? (reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="flex-shrink-0">
                    <div className="relative w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                        {media.posterUrl ? (
                            <Image src={media.posterUrl} alt={media.title} fill className="object-cover" sizes="256px" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Film className="size-12 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
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
                        {media.streamingLink && (
                            <Button variant="outline" asChild className="gap-2">
                                <a href={media.streamingLink} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-4" /> Watch Now
                                </a>
                            </Button>
                        )}
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
                            <Link href="/login" className="text-primary underline">Sign in</Link> to add to watchlist and write reviews.
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
            />
        </div>
    );
}
