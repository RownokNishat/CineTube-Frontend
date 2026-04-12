"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactMessage } from "@/types/content.types";
import { formatDistanceToNow } from "date-fns";
import { MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";

interface ContactMessageRowProps {
    message: ContactMessage;
    onMarkRead: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export function ContactMessageRow({ message, onMarkRead }: ContactMessageRowProps) {
    const [isPending, startTransition] = useTransition();
    const [isRead, setIsRead] = useState(message.isRead);

    const handleMarkRead = () => {
        startTransition(async () => {
            const res = await onMarkRead(message.id);
            if (res.success) {
                setIsRead(true);
                toast.success("Marked as read");
            } else {
                toast.error(res.message || "Failed to mark as read");
            }
        });
    };

    return (
        <tr className={`border-b transition-colors ${isRead ? "bg-muted/20" : "bg-background"}`}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {isRead ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                    )}
                    <div>
                        <p className="font-medium text-sm">{message.name}</p>
                        <p className="text-xs text-muted-foreground">{message.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-sm">{message.subject}</td>
            <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">{message.message}</td>
            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </td>
            <td className="px-4 py-3">
                <Badge variant={isRead ? "outline" : "default"} className="text-xs">
                    {isRead ? "Read" : "Unread"}
                </Badge>
            </td>
            <td className="px-4 py-3">
                {!isRead && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkRead}
                        disabled={isPending}
                        className="text-xs"
                    >
                        {isPending ? "Marking..." : "Mark Read"}
                    </Button>
                )}
            </td>
        </tr>
    );
}
