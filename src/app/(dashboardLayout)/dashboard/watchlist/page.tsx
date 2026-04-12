import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QueryPagination from "@/components/shared/QueryPagination";
import { getWatchlist } from "@/services/watchlist.services";
import { Bookmark, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RemoveFromWatchlistButton from "./RemoveFromWatchlistButton";

export const dynamic = "force-dynamic";

interface WatchlistPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

export default async function WatchlistPage({ searchParams }: WatchlistPageProps) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 12));
    let watchlist: Awaited<ReturnType<typeof getWatchlist>>["data"] = [];
    let total = 0;
    let totalPages = 1;
    try {
        const res = await getWatchlist({ page, limit });
        watchlist = res.data ?? [];
        total = res.meta?.total ?? watchlist.length;
        totalPages = res.meta?.totalPages ?? 1;
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="size-6" /> My Watchlist
                </h1>
                <p className="text-muted-foreground">{total} item{total !== 1 ? "s" : ""}</p>
            </div>

            {watchlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {watchlist.map((item) => (
                        <Card key={item.id} className="overflow-hidden group">
                            {(() => {
                                const targetMediaId = item.mediaId || item.media?.id;
                                if (!targetMediaId) {
                                    return (
                                        <CardContent className="p-3">
                                            <p className="text-sm text-muted-foreground">Media reference unavailable for this watchlist item.</p>
                                        </CardContent>
                                    );
                                }

                                return (
                                    <>
                            <div className="relative aspect-2/3 overflow-hidden bg-muted">
                                {item.media?.posterUrl ? (
                                    <Image src={item.media.posterUrl} alt={item.media.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="300px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Film className="size-10 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-3 space-y-2">
                                <Link href={`/media/${targetMediaId}`} className="font-semibold text-sm line-clamp-1 hover:text-primary">{item.media?.title}</Link>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1 flex-wrap">
                                        <Badge variant="outline" className="text-xs">{item.media?.mediaType}</Badge>
                                        <Badge variant={item.media?.pricingType === "FREE" ? "secondary" : "default"} className="text-xs">
                                            {item.media?.pricingType}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{item.media?.releaseYear}</span>
                                </div>
                                <RemoveFromWatchlistButton mediaId={targetMediaId} />
                            </CardContent>
                                    </>
                                );
                            })()}
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    <Bookmark className="size-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Your watchlist is empty</p>
                    <p className="text-sm mb-4">Start adding movies and series you want to watch</p>
                    <Button asChild><Link href="/media">Browse Media</Link></Button>
                </div>
            )}

            <QueryPagination currentPage={page} totalPages={totalPages} totalItems={total} className="px-0" />
        </div>
    );
}
