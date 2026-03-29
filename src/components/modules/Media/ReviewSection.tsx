"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createComment, getComments } from "@/services/comment.services";
import { createReview, toggleReviewLike } from "@/services/review.services";
import { Comment, Review } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewSectionProps {
    mediaId: string;
    initialReviews: Review[];
    isLoggedIn: boolean;
    userId?: string;
}

const ReviewCard = ({ review, userId }: { review: Review; userId?: string }) => {
    const [likes, setLikes] = useState(review._count?.likes ?? 0);
    const [liked, setLiked] = useState(review.isLiked ?? false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    const handleLike = async () => {
        if (!userId) { toast.error("Please login to like reviews"); return; }
        try {
            await toggleReviewLike(review.id);
            setLiked((v) => !v);
            setLikes((v) => liked ? v - 1 : v + 1);
        } catch {
            toast.error("Failed to toggle like");
        }
    };

    const loadComments = async () => {
        if (comments.length > 0) { setShowComments((v) => !v); return; }
        setLoadingComments(true);
        try {
            const res = await getComments({ reviewId: review.id });
            setComments(res.data ?? []);
            setShowComments(true);
        } catch {
            toast.error("Failed to load comments");
        } finally {
            setLoadingComments(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!userId) { toast.error("Please login to comment"); return; }
        setSubmittingComment(true);
        try {
            const res = await createComment({ reviewId: review.id, content: commentText });
            setComments((prev) => [...prev, res.data]);
            setCommentText("");
            toast.success("Comment added");
        } catch {
            toast.error("Failed to add comment");
        } finally {
            setSubmittingComment(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                            <AvatarImage src={review.user?.image ?? ""} />
                            <AvatarFallback>{review.user?.name?.[0] ?? "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{review.user?.name}</p>
                            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{review.rating}/10</span>
                    </div>
                </div>

                {review.isSpoiler && (
                    <Badge variant="destructive" className="text-xs">Contains Spoilers</Badge>
                )}

                <p className="text-sm leading-relaxed">{review.content}</p>

                {review.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {review.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <button onClick={handleLike} className={`flex items-center gap-1 text-sm transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}>
                        <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                        <span>{likes}</span>
                    </button>
                    <button onClick={loadComments} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="size-4" />
                        <span>{review._count?.comments ?? 0} Comments</span>
                    </button>
                </div>

                {showComments && (
                    <div className="border-t pt-3 space-y-3">
                        {loadingComments ? (
                            <p className="text-sm text-muted-foreground">Loading comments...</p>
                        ) : (
                            <>
                                {comments.map((c) => (
                                    <div key={c.id} className="flex gap-2 text-sm">
                                        <Avatar className="size-6 shrink-0">
                                            <AvatarFallback className="text-xs">{c.user?.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="font-medium mr-2">{c.user?.name}</span>
                                            <span className="text-muted-foreground">{c.content}</span>
                                        </div>
                                    </div>
                                ))}
                                {userId && (
                                    <form onSubmit={handleComment} className="flex gap-2">
                                        <input
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 text-sm border rounded px-3 py-1.5 bg-background"
                                        />
                                        <Button size="sm" type="submit" disabled={submittingComment || !commentText.trim()}>
                                            {submittingComment ? "..." : "Post"}
                                        </Button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ReviewSection = ({ mediaId, initialReviews, isLoggedIn, userId }: ReviewSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(7);
    const [content, setContent] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [tags, setTags] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) { setError("Review content is required"); return; }
        setSubmitting(true);
        setError(null);
        try {
            const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
            const res = await createReview({ mediaId, rating, content, isSpoiler, tags: tagList });
            setReviews((prev) => [res.data, ...prev]);
            setContent("");
            setTags("");
            setIsSpoiler(false);
            setRating(7);
            toast.success("Review submitted! Pending admin approval.");
        } catch (err: any) {
            setError(err?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {isLoggedIn && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Rating: <strong>{rating}/10</strong></Label>
                                <input type="range" min={1} max={10} step={1} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full accent-primary" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1</span><span>10</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Review</Label>
                                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts..." rows={4} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. classic, underrated, must-watch" className="w-full border rounded px-3 py-2 text-sm bg-background" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="spoiler" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="size-4" />
                                <Label htmlFor="spoiler" className="text-sm cursor-pointer">Contains spoilers</Label>
                            </div>
                            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                            <AppSubmitButton isPending={submitting} pendingLabel="Submitting...">Submit Review</AppSubmitButton>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div>
                <h3 className="text-xl font-semibold mb-4">
                    Reviews <span className="text-muted-foreground text-base font-normal">({reviews.length})</span>
                </h3>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} userId={userId} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
