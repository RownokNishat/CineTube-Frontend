import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getWatchlist } from "@/services/watchlist.services";
import { Bookmark, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RemoveFromWatchlistButton from "./RemoveFromWatchlistButton";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
    let watchlist: Awaited<ReturnType<typeof getWatchlist>>["data"] = [];
    try {
        const res = await getWatchlist();
        watchlist = res.data ?? [];
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="size-6" /> My Watchlist
                </h1>
                <p className="text-muted-foreground">{watchlist.length} item{watchlist.length !== 1 ? "s" : ""}</p>
            </div>

            {watchlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {watchlist.map((item) => (
                        <Card key={item.id} className="overflow-hidden group">
                            <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                                {item.media?.posterUrl ? (
                                    <Image src={item.media.posterUrl} alt={item.media.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="300px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Film className="size-10 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-3 space-y-2">
                                <Link href={`/media/${item.mediaId}`} className="font-semibold text-sm line-clamp-1 hover:text-primary">{item.media?.title}</Link>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1 flex-wrap">
                                        <Badge variant="outline" className="text-xs">{item.media?.mediaType}</Badge>
                                        <Badge variant={item.media?.pricingType === "FREE" ? "secondary" : "default"} className="text-xs">
                                            {item.media?.pricingType}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{item.media?.releaseYear}</span>
                                </div>
                                <RemoveFromWatchlistButton mediaId={item.mediaId} />
                            </CardContent>
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
        </div>
    );
}
