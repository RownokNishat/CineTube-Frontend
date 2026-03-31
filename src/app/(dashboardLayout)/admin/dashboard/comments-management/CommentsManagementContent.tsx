"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/types/review.types";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentsManagementPageProps {
    comments: Comment[];
    total: number;
    page: number;
    selectedStatus?: "PENDING" | "PUBLISHED" | "UNPUBLISHED";
    searchTerm?: string;
    onApproveComment: (commentId: string) => Promise<ApiResponse<Comment> | ApiErrorResponse>;
    onUnpublishComment: (commentId: string) => Promise<ApiResponse<Comment> | ApiErrorResponse>;
    onDeleteComment: (commentId: string) => Promise<ApiResponse<null> | ApiErrorResponse>;
}

export default function CommentsManagementContent({
    comments,
    total,
    page,
    selectedStatus,
    searchTerm,
    onApproveComment,
    onUnpublishComment,
    onDeleteComment,
}: CommentsManagementPageProps) {
    const [allComments, setAllComments] = useState(comments);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [moderatingCommentId, setModeratingCommentId] = useState<string | null>(null);

    const updateLocalComment = (updatedComment: Comment) => {
        setAllComments((prev) => prev.map((c) => (c.id === updatedComment.id ? { ...c, ...updatedComment } : c)));
    };

    const handleApproveComment = async (commentId: string) => {
        setModeratingCommentId(commentId);
        try {
            const result = await onApproveComment(commentId);
            if (!result.success) {
                toast.error(result.message || "Failed to approve comment");
                return;
            }

            if ("data" in result && result.data) {
                updateLocalComment(result.data);
            }

            toast.success("Comment approved");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to approve comment");
        } finally {
            setModeratingCommentId(null);
        }
    };

    const handleUnpublishComment = async (commentId: string) => {
        setModeratingCommentId(commentId);
        try {
            const result = await onUnpublishComment(commentId);
            if (!result.success) {
                toast.error(result.message || "Failed to unpublish comment");
                return;
            }

            if ("data" in result && result.data) {
                updateLocalComment(result.data);
            }

            toast.success("Comment unpublished");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to unpublish comment");
        } finally {
            setModeratingCommentId(null);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        setIsDeleting(true);
        try {
            const result = await onDeleteComment(commentId);
            if (result.success) {
                setAllComments((prev) => prev.filter((c) => c.id !== commentId));
                toast.success("Comment deleted successfully");
                setDeletingCommentId(null);
            } else {
                toast.error(result.message || "Failed to delete comment");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete comment");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <MessageCircle className="size-6" /> Comments Moderation
                </h1>
                <p className="text-muted-foreground">{total} total comments</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Badge variant={!selectedStatus ? "default" : "outline"}>All</Badge>
                <Badge variant={selectedStatus === "PENDING" ? "default" : "outline"}>Pending</Badge>
                <Badge variant={selectedStatus === "PUBLISHED" ? "default" : "outline"}>Published</Badge>
                <Badge variant={selectedStatus === "UNPUBLISHED" ? "default" : "outline"}>Unpublished</Badge>
                {searchTerm ? <Badge variant="secondary">Search: {searchTerm}</Badge> : null}
            </div>

            <Card>
                <CardContent className="p-0">
                    {allComments.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground">No comments to moderate</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Media</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Replies</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allComments.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell className="font-medium">
                                            {comment.user?.name || "Unknown"}
                                        </TableCell>
                                        <TableCell className="max-w-40 truncate">
                                            {comment.review?.media?.title || "Unknown media"}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {comment.content}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    comment.status === "PUBLISHED"
                                                        ? "default"
                                                        : comment.status === "UNPUBLISHED"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {comment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {comment.replies && comment.replies.length > 0 ? (
                                                <Badge variant="outline">{comment.replies.length}</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleApproveComment(comment.id)}
                                                    disabled={moderatingCommentId === comment.id || comment.status === "PUBLISHED"}
                                                >
                                                    <ShieldCheck className="size-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleUnpublishComment(comment.id)}
                                                    disabled={moderatingCommentId === comment.id || comment.status === "UNPUBLISHED"}
                                                >
                                                    <ShieldX className="size-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDeletingCommentId(comment.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                deletingCommentId && handleDeleteComment(deletingCommentId)
                            }
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Page {page}</span>
                <div className="flex gap-2">
                    {page > 1 ? (
                        <Link href={`?page=${page - 1}`}>Previous</Link>
                    ) : (
                        <span>Previous</span>
                    )}
                    <Link href={`?page=${page + 1}`}>Next</Link>
                </div>
            </div>
        </div>
    );
}
