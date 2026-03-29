import { getUserInfo } from "@/services/auth.services";
import { getWatchlist } from "@/services/watchlist.services";
import { getMySubscription } from "@/services/subscription.services";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, CreditCard, Film, Star } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
    const [user, watchlistRes, subscriptionRes] = await Promise.all([
        getUserInfo().catch(() => null),
        getWatchlist().catch(() => ({ data: [] })),
        getMySubscription().catch(() => ({ data: null })),
    ]);

    const watchlist = watchlistRes.data ?? [];
    const subscription = subscriptionRes.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name ?? "User"}!</h1>
                <p className="text-muted-foreground">Your CineTube dashboard</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Bookmark className="size-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{watchlist.length}</p>
                            <p className="text-sm text-muted-foreground">Watchlist Items</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                            <Star className="size-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">—</p>
                            <p className="text-sm text-muted-foreground">Reviews Written</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                            <CreditCard className="size-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold capitalize">{subscription?.plan?.toLowerCase() ?? "Free"}</p>
                            <p className="text-sm text-muted-foreground">Current Plan</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription status */}
            {subscription && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="size-5" /> Subscription
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{subscription.plan} Plan</p>
                                <p className="text-sm text-muted-foreground">
                                    {subscription.status === "ACTIVE" && subscription.endDate
                                        ? `Renews ${new Date(subscription.endDate).toLocaleDateString()}`
                                        : subscription.status}
                                </p>
                            </div>
                            <Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>
                                {subscription.status}
                            </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/subscription">Manage Subscription</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Watchlist preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center gap-2"><Bookmark className="size-5" /> Watchlist</span>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/watchlist">View all</Link>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {watchlist.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {watchlist.slice(0, 6).map((item) => (
                                <Link key={item.id} href={`/media/${item.mediaId}`} className="group">
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted relative">
                                        {item.media?.posterUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.media.posterUrl} alt={item.media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Film className="size-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs mt-1 line-clamp-1 group-hover:text-primary">{item.media?.title}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Bookmark className="size-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Your watchlist is empty.</p>
                            <Button variant="link" asChild><Link href="/media">Browse media</Link></Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
