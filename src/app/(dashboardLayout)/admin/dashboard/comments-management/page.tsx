import CommentsManagementContent from "./CommentsManagementContent";
import { getAdminComments } from "@/services/comment.services";
import {
    approveCommentAction,
    deleteCommentAsAdminAction,
    unpublishCommentAction,
} from "./_action";
import { type Comment } from "@/types/review.types";
import { PaginationMeta } from "@/types/api.types";

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
    let totalPages = 0;
    let meta: PaginationMeta | undefined;

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
        totalPages = res.meta?.totalPages ?? 0;
        meta = res.meta;
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
            totalPages={totalPages || meta?.totalPages || 0}
            page={page}
            selectedStatus={status}
            searchTerm={searchTerm}
            onApproveComment={handleApproveComment}
            onUnpublishComment={handleUnpublishComment}
            onDeleteComment={handleDeleteComment}
        />
    );
}
