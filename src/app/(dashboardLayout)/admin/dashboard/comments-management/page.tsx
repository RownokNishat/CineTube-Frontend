import CommentsManagementContent from "./CommentsManagementContent";
import { getReviews } from "@/services/review.services";
import { deleteCommentAsAdmin } from "./_action";

export const dynamic = "force-dynamic";

export default async function CommentsManagementPage() {
    // Fetch all reviews to get their comments
    let allComments = [];

    try {
        const res = await getReviews({ limit: 100 });
        const reviews = res.data ?? [];

        // Flatten all comments from all reviews
        allComments = reviews
            .flatMap((review) => review.comments || [])
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
