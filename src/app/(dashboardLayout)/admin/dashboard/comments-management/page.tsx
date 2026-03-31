import CommentsManagementContent from "./CommentsManagementContent";
import { getComments } from "@/services/comment.services";
import { getReviews } from "@/services/review.services";
import { deleteCommentAsAdmin } from "./_action";
import { type Comment, type Review } from "@/types/review.types";

export const dynamic = "force-dynamic";

export default async function CommentsManagementPage() {
    let allComments: Comment[] = [];

    try {
        const res = await getReviews({ limit: 100 });
        const reviews = (res.data ?? []) as Review[];
        const reviewsWithComments = reviews.filter(
            (review) => (review._count?.comments ?? 0) > 0
        );

        const commentGroups = await Promise.all(
            reviewsWithComments.map(async (review) => {
                try {
                    const commentsRes = await getComments({
                        reviewId: review.id,
                        limit: 100,
                    });

                    return commentsRes.data ?? [];
                } catch {
                    return [];
                }
            })
        );

        allComments = commentGroups
            .flat()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    }

    const handleDeleteComment = async (commentId: string) => {
        "use server";
        try {
            const result = await deleteCommentAsAdmin(commentId);
            return result.success ?? false;
        } catch {
            return false;
        }
    };

    return (
        <CommentsManagementContent
            comments={allComments}
            onDeleteComment={handleDeleteComment}
        />
    );
}
