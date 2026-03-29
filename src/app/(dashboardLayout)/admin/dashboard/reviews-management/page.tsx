import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReviews } from "@/services/review.services";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReviewActionButtons from "./ReviewActionButtons";

export const dynamic = "force-dynamic";

interface ReviewsManagementPageProps {
    searchParams: Promise<{ page?: string }>;
}

const ReviewsManagementPage = async ({ searchParams }: ReviewsManagementPageProps) => {
    const params = await searchParams;
    const page = Number(params.page ?? 1);

    let reviews: Awaited<ReturnType<typeof getReviews>>["data"] = [];
    let total = 0;
    try {
        const res = await getReviews({ page, limit: 20, sortBy: "createdAt", sortOrder: "desc" });
        reviews = res.data ?? [];
        total = res.meta?.total ?? 0;
    } catch { /* empty */ }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Star className="size-6" /> Reviews Management</h1>
                <p className="text-muted-foreground">{total} total reviews</p>
            </div>

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
        </div>
    );
}

export default ReviewsManagementPage;