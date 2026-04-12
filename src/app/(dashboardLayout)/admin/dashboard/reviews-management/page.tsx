import AutoFilterForm from "@/components/shared/AutoFilterForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminMediaReviews, getMediaReviewStats, getReviewById } from "@/services/review.services";
import { getMediaList } from "@/services/media.services";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReviewActionButtons from "./ReviewActionButtons";
import { type ReviewStats } from "@/types/review.types";
import Link from "next/link";
import QueryPagination from "@/components/shared/QueryPagination";

export const dynamic = "force-dynamic";

interface ReviewsManagementPageProps {
    searchParams: Promise<{
        page?: string;
        mediaId?: string;
        searchTerm?: string;
        status?: string;
    }>;
}

const ReviewsManagementPage = async ({ searchParams }: ReviewsManagementPageProps) => {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const mediaId = params.mediaId;
    const searchTerm = params.searchTerm?.trim();
    const selectedStatus = params.status === "PUBLISHED" || params.status === "UNPUBLISHED"
        ? params.status
        : "PENDING";
    const statusLabel = selectedStatus.toLowerCase();

    let reviews: Awaited<ReturnType<typeof getAdminMediaReviews>>["data"] = [];
    let total = 0;
    let totalPages = 1;
    let stats: ReviewStats | null = null;
    let mediaCatalog: Awaited<ReturnType<typeof getMediaList>>["data"] = [];
    let mediaCatalogTotal = 0;
    let mediaCatalogTotalPages = 1;

    if (!mediaId) {
        try {
            const mediaRes = await getMediaList({
                page,
                limit: 50,
                sortBy: "createdAt",
                sortOrder: "desc",
                searchTerm,
            });
            mediaCatalog = mediaRes.data ?? [];
            mediaCatalogTotal = mediaRes.meta?.total ?? mediaCatalog.length;
            mediaCatalogTotalPages = mediaRes.meta?.totalPages ?? 1;
        } catch {
            mediaCatalog = [];
        }
    }

    if (mediaId) {
        try {
            const statsRes = await getMediaReviewStats(mediaId);
            stats = statsRes.data;
        } catch {
            stats = null;
        }
    }

    try {
        if (mediaId) {
            const res = await getAdminMediaReviews(mediaId, {
                page,
                limit: 20,
                searchTerm,
                status: selectedStatus,
                sortBy: "createdAt",
                sortOrder: "desc",
            });
            reviews = res.data ?? [];
            total = res.meta?.total ?? 0;
            totalPages = res.meta?.totalPages ?? 1;

            if (selectedStatus === "PENDING" && reviews.length === 0 && stats?.pendingReviews?.length) {
                const reviewDetails = await Promise.all(
                    stats.pendingReviews.map(async (pendingReview) => {
                        try {
                            const detailRes = await getReviewById(pendingReview.id);
                            return detailRes.data;
                        } catch {
                            return null;
                        }
                    })
                );

                reviews = reviewDetails.filter((review): review is NonNullable<typeof review> => Boolean(review));
                total = stats.pendingReviewsCount;
            }
        }
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Star className="size-6" /> Reviews Management</h1>
                <p className="text-muted-foreground">
                    {mediaId ? `${total} ${statusLabel} reviews` : "Select a media title to moderate reviews"}
                </p>
            </div>

            {!mediaId && (
                <Card>
                    <CardContent className="p-4">
                        <AutoFilterForm className="mb-4 flex flex-col gap-3 sm:flex-row">
                            <Input
                                type="search"
                                name="searchTerm"
                                defaultValue={searchTerm ?? ""}
                                placeholder="Search media by title, director, or synopsis"
                                className="sm:max-w-md"
                            />
                            <div className="flex gap-2">
                                {searchTerm && (
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/admin/dashboard/reviews-management">Reset</Link>
                                    </Button>
                                )}
                            </div>
                        </AutoFilterForm>

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
                                            <Link href={`/admin/dashboard/reviews-management?mediaId=${media.id}&status=${selectedStatus}`}>
                                                Manage Reviews
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No media found.</p>
                        )}

                        <QueryPagination currentPage={page} totalPages={mediaCatalogTotalPages} totalItems={mediaCatalogTotal} className="px-0" />
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
                <CardContent className="space-y-4 p-4">
                    <AutoFilterForm className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Input
                                type="search"
                                name="searchTerm"
                                defaultValue={searchTerm ?? ""}
                                placeholder="Search review content"
                                className="sm:w-80"
                            />
                            <input type="hidden" name="mediaId" value={mediaId} />
                            <select
                                name="status"
                                defaultValue={selectedStatus}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="UNPUBLISHED">Unpublished</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={`/admin/dashboard/reviews-management?mediaId=${mediaId}&status=PENDING`}>
                                    Reset
                                </Link>
                            </Button>
                            <Button type="button" variant="ghost" asChild>
                                <Link href="/admin/dashboard/reviews-management">Change Media</Link>
                            </Button>
                        </div>
                    </AutoFilterForm>

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

            {mediaId && <QueryPagination currentPage={page} totalPages={totalPages} totalItems={total} className="px-0" />}
        </div>
    );
}

export default ReviewsManagementPage;