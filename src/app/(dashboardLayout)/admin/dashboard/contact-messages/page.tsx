import { getAdminContactMessages } from "@/services/content.services";
import { ContactMessage } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import QueryPagination from "@/components/shared/QueryPagination";
import { ContactMessageRow } from "./ContactMessageRow";
import { markContactMessageReadAction } from "./_action";
import { Mail, MailOpen, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

interface ContactMessagesPageProps {
    searchParams: Promise<{
        page?: string;
        isRead?: string;
    }>;
}

export default async function ContactMessagesPage({ searchParams }: ContactMessagesPageProps) {
    const params = await searchParams;
    const page = Number(params.page ?? 1);
    const isRead = params.isRead === "true" ? true : params.isRead === "false" ? false : undefined;

    let messages: ContactMessage[] = [];
    let total = 0;
    let totalPages = 1;
    let unreadCount = 0;

    try {
        const [res, unreadRes] = await Promise.all([
            getAdminContactMessages({ page, limit: 20, ...(isRead !== undefined ? { isRead } : {}) }),
            getAdminContactMessages({ page: 1, limit: 1, isRead: false }),
        ]);
        messages = res.data ?? [];
        total = res.meta?.total ?? 0;
        totalPages = res.meta?.totalPages ?? 1;
        unreadCount = unreadRes.meta?.total ?? 0;
    } catch (error) {
        console.error("Failed to fetch contact messages:", error);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-6 w-6" />
                        Contact Messages
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {total} total message{total !== 1 ? "s" : ""}
                        {unreadCount > 0 && (
                            <span className="ml-2 text-primary font-medium">• {unreadCount} unread</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant={!isRead && isRead !== false ? "default" : "outline"} className="cursor-pointer">
                        <a href="?isRead=">All</a>
                    </Badge>
                    <Badge variant={isRead === false ? "default" : "outline"} className="cursor-pointer">
                        <a href="?isRead=false">
                            <Mail className="h-3 w-3 inline mr-1" />
                            Unread
                        </a>
                    </Badge>
                    <Badge variant={isRead === true ? "default" : "outline"} className="cursor-pointer">
                        <a href="?isRead=true">
                            <MailOpen className="h-3 w-3 inline mr-1" />
                            Read
                        </a>
                    </Badge>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {messages.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No messages found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                                        <th className="px-4 py-3 text-left">Sender</th>
                                        <th className="px-4 py-3 text-left">Subject</th>
                                        <th className="px-4 py-3 text-left">Message</th>
                                        <th className="px-4 py-3 text-left">Sent</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg) => (
                                        <ContactMessageRow
                                            key={msg.id}
                                            message={msg}
                                            onMarkRead={markContactMessageReadAction}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <QueryPagination currentPage={page} totalPages={totalPages} totalItems={total} />
            )}
        </div>
    );
}
