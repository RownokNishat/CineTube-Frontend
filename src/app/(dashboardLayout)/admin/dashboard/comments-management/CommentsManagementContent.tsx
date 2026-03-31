"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/types/review.types";
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
    onDeleteComment: (commentId: string) => Promise<boolean>;
}

export default function CommentsManagementContent({
    comments,
    onDeleteComment,
}: CommentsManagementPageProps) {
    const [allComments, setAllComments] = useState(comments);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteComment = async (commentId: string) => {
        setIsDeleting(true);
        try {
            const success = await onDeleteComment(commentId);
            if (success) {
                setAllComments((prev) => prev.filter((c) => c.id !== commentId));
                toast.success("Comment deleted successfully");
                setDeletingCommentId(null);
            } else {
                toast.error("Failed to delete comment");
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
                <p className="text-muted-foreground">{allComments.length} total comments</p>
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
                                    <TableHead>Comment</TableHead>
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
                                        <TableCell className="max-w-xs truncate">
                                            {comment.content}
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
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDeletingCommentId(comment.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
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
        </div>
    );
}
