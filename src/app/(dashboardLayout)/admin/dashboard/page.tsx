import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/services/user.services";
import { getMediaList } from "@/services/media.services";
import { getReviews } from "@/services/review.services";
import { Film, Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const [usersRes, mediaRes, pendingReviewsRes, allReviewsRes] = await Promise.all([
        getAllUsers({ limit: 1 }).catch(() => ({ meta: { total: 0 } })),
        getMediaList({ limit: 1 }).catch(() => ({ meta: { total: 0 } })),
        getReviews({ limit: 5 }).catch(() => ({ data: [] })),
        getReviews({ limit: 1 }).catch(() => ({ meta: { total: 0 } })),
    ]);

    const stats = [
        { title: "Total Users", value: (usersRes as { meta?: { total?: number } }).meta?.total ?? 0, icon: Users, href: "/admin/dashboard/users-management", color: "text-blue-500" },
        { title: "Total Media", value: (mediaRes as { meta?: { total?: number } }).meta?.total ?? 0, icon: Film, href: "/admin/dashboard/media-management", color: "text-purple-500" },
        { title: "Total Reviews", value: (allReviewsRes as { meta?: { total?: number } }).meta?.total ?? 0, icon: Star, href: "/admin/dashboard/reviews-management", color: "text-yellow-500" },
        { title: "Pending Reviews", value: (pendingReviewsRes.data ?? []).length, icon: Clock, href: "/admin/dashboard/reviews-management", color: "text-orange-500" },
    ];

    const recentReviews = pendingReviewsRes.data ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage CineTube content and users</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div className={`p-3 rounded-xl bg-muted`}>
                                    <stat.icon className={`size-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/admin/dashboard/media-management"><Film className="size-4" /> Add New Movie/Series</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/admin/dashboard/reviews-management"><Star className="size-4" /> Moderate Reviews</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/admin/dashboard/users-management"><Users className="size-4" /> Manage Users</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/admin/dashboard/genres-management"><Film className="size-4" /> Manage Genres</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span>Recent Reviews</span>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/dashboard/reviews-management">View all</Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentReviews.length > 0 ? (
                            <div className="space-y-3">
                                {recentReviews.map((review) => (
                                    <div key={review.id} className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{review.user?.name}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{review.content}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge variant="outline" className="text-xs">{review.rating}/10</Badge>
                                            <Badge variant={review.status === "PUBLISHED" ? "default" : review.status === "PENDING" ? "secondary" : "destructive"} className="text-xs">
                                                {review.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent reviews</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
