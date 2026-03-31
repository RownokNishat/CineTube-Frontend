import CommentsManagementContent from "./CommentsManagementContent";
import { getAdminComments } from "@/services/comment.services";
import {
    approveCommentAction,
    deleteCommentAsAdminAction,
    unpublishCommentAction,
} from "./_action";
import { type Comment } from "@/types/review.types";

export const dynamic = "force-dynamic";

interface CommentsManagementPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        searchTerm?: string;
    }>;
}

export default async function CommentsManagementPage({ searchParams }: CommentsManagementPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const status = params.status as "PENDING" | "PUBLISHED" | "UNPUBLISHED" | undefined;
    const searchTerm = params.searchTerm?.trim();

    let allComments: Comment[] = [];
    let total = 0;

    try {
        const res = await getAdminComments({
            page,
            limit: 20,
            status,
            searchTerm,
            sort: "-createdAt",
        });

        allComments = res.data ?? [];
        total = res.meta?.total ?? 0;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    }

    const handleApproveComment = async (commentId: string) => {
        "use server";
        const result = await approveCommentAction(commentId);
        return result;
    };

    const handleUnpublishComment = async (commentId: string) => {
        "use server";
        const result = await unpublishCommentAction(commentId);
        return result;
    };

    const handleDeleteComment = async (commentId: string) => {
        "use server";
        const result = await deleteCommentAsAdminAction(commentId);
        return result;
    };

    return (
        <CommentsManagementContent
            comments={allComments}
            total={total}
            page={page}
            selectedStatus={status}
            searchTerm={searchTerm}
            onApproveComment={handleApproveComment}
            onUnpublishComment={handleUnpublishComment}
            onDeleteComment={handleDeleteComment}
        />
    );
}
