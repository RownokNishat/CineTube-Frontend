import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getMediaReviewStats, getReviews } from "@/services/review.services";
import { getMediaList } from "@/services/media.services";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReviewActionButtons from "./ReviewActionButtons";
import { type ReviewStats } from "@/types/review.types";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ReviewsManagementPageProps {
    searchParams: Promise<{ page?: string; mediaId?: string }>;
}

const ReviewsManagementPage = async ({ searchParams }: ReviewsManagementPageProps) => {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const mediaId = params.mediaId;

    let reviews: Awaited<ReturnType<typeof getReviews>>["data"] = [];
    let total = 0;
    let stats: ReviewStats | null = null;
    let mediaCatalog: Awaited<ReturnType<typeof getMediaList>>["data"] = [];

    if (!mediaId) {
        try {
            const mediaRes = await getMediaList({ limit: 50, sortBy: "createdAt", sortOrder: "desc" });
            mediaCatalog = mediaRes.data ?? [];
        } catch {
            mediaCatalog = [];
        }
    }

    try {
        if (mediaId) {
            const res = await getReviews({
                mediaId,
                page,
                limit: 20,
                status: "PENDING",
                sortBy: "createdAt",
                sortOrder: "desc",
            });
            reviews = res.data ?? [];
            total = res.meta?.total ?? 0;
        }
    } catch { /* empty */ }

    if (mediaId) {
        try {
            const statsRes = await getMediaReviewStats(mediaId);
            stats = statsRes.data;
        } catch {
            stats = null;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Star className="size-6" /> Reviews Management</h1>
                <p className="text-muted-foreground">{mediaId ? `${total} pending reviews` : "Select a media title to moderate reviews"}</p>
            </div>

            {!mediaId && (
                <Card>
                    <CardContent className="p-4">
                        {mediaCatalog.length > 0 ? (
                            <div className="space-y-2">
                                {mediaCatalog.map((media) => (
                                    <div key={media.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                                        <div>
                                            <p className="font-medium">{media.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {media.releaseYear} • {media.mediaType}
                                            </p>
                                        </div>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/dashboard/reviews-management?mediaId=${media.id}`}>
                                                Manage Reviews
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No media found.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {mediaId && stats && (
                <Card>
                    <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Media</p>
                            <p className="font-semibold">{stats.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <p className="font-semibold">{stats.averageRating?.toFixed(1) ?? "0.0"} / 10</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Reviews</p>
                            <p className="font-semibold">{stats.pendingReviewsCount}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {mediaId && (
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Review</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">{review.user?.name ?? "Unknown"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{review.rating}/10</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-64">
                                        <p className="text-sm line-clamp-2">{review.content}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            review.status === "PUBLISHED" ? "default" :
                                            review.status === "PENDING" ? "secondary" : "destructive"
                                        }>
                                            {review.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReviewActionButtons reviewId={review.id} currentStatus={review.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No reviews found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            )}
        </div>
    );
}

export default ReviewsManagementPage;