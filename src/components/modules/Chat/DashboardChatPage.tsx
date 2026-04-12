"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QueryPagination from "@/components/shared/QueryPagination";
import { getAdminSessions, getMySessions, getSessionMessages, sendMessage, updateSessionStatus } from "@/services/chat.services";
import { PaginationMeta } from "@/types/api.types";
import { CheckCircle2, Inbox, MessageSquare, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ChatMode = "admin" | "user-closed";
type ChatStatus = "OPEN" | "RESOLVED";

interface ChatUser {
    id: string;
    name: string;
    email?: string;
    role?: string;
    image?: string | null;
}

interface ChatMessage {
    id: string;
    senderId: string;
    content?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    sender?: ChatUser;
}

interface ChatSession {
    id: string;
    status: ChatStatus;
    createdAt?: string;
    updatedAt?: string;
    user?: ChatUser;
    messages?: ChatMessage[];
}

interface DashboardChatPageProps {
    mode: ChatMode;
    currentUserId: string;
}

const getDisplayName = (session: ChatSession) => session.user?.name || "User";

const DashboardChatPage = ({ mode, currentUserId }: DashboardChatPageProps) => {
    const isAdminMode = mode === "admin";
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [sessionsMeta, setSessionsMeta] = useState<PaginationMeta | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [activeSessionStatus, setActiveSessionStatus] = useState<ChatStatus | null>(null);
    const [messagesMeta, setMessagesMeta] = useState<PaginationMeta | null>(null);
    const { messages, setMessages, realtimeArrived } = useRealtimeChat(activeSessionId ?? '');
    const [inputText, setInputText] = useState("");
    const [sessionFilter, setSessionFilter] = useState<"ALL" | ChatStatus>(isAdminMode ? "ALL" : "RESOLVED");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sessionPage = Math.max(1, Number(searchParams.get("page") ?? 1));
    const messagePage = Math.max(1, Number(searchParams.get("messagePage") ?? 1));
    const selectedSessionId = searchParams.get("sessionId");

    const updateQuery = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const filteredSessions = useMemo(() => {
        const scopedSessions = isAdminMode ? sessions : sessions.filter((session) => session.status === "RESOLVED");
        if (sessionFilter === "ALL") return scopedSessions;
        return scopedSessions.filter((session) => session.status === sessionFilter);
    }, [isAdminMode, sessionFilter, sessions]);

    const isNearBottom = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    }, []);

    const scrollToBottom = useCallback((force = false) => {
        if (force || isNearBottom()) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isNearBottom]);

    // Only auto-scroll on realtime messages if the user is already near the bottom
    useEffect(() => {
        if (realtimeArrived.current) {
            scrollToBottom();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const loadMessages = useCallback(async (sessionId: string, status: ChatStatus, page = 1) => {
        const response = await getSessionMessages(sessionId, { page, limit: 25 });
        if (!response.success) {
            toast.error(response.message || "Failed to load chat messages");
            return;
        }

        setActiveSessionId(sessionId);
        setActiveSessionStatus(status);
        setMessages((response.data ?? []) as ChatMessage[]);
        setMessagesMeta((response.meta ?? null) as PaginationMeta | null);
        // Force scroll to bottom after loading messages for a session
        setTimeout(() => scrollToBottom(true), 50);
    }, [scrollToBottom]);

    const loadSessions = useCallback(async () => {
        setIsLoading(true);
        const response = isAdminMode
            ? await getAdminSessions({ page: sessionPage, limit: 10 })
            : await getMySessions({ page: sessionPage, limit: 10 });

        if (!response.success) {
            toast.error(response.message || "Failed to load chats");
            setSessions([]);
            setSessionsMeta(null);
            setMessages([]);
            setMessagesMeta(null);
            setActiveSessionId(null);
            setActiveSessionStatus(null);
            setIsLoading(false);
            return;
        }

        const sessionData = ((response.data ?? []) as ChatSession[]).filter((session) =>
            isAdminMode ? true : session.status === "RESOLVED",
        );

        setSessions(sessionData);
        setSessionsMeta((response.meta ?? null) as PaginationMeta | null);

        const nextActiveSession = sessionData.find((session) => session.id === selectedSessionId)
            ?? sessionData.find((session) => session.id === activeSessionId)
            ?? sessionData[0]
            ?? null;
        if (nextActiveSession) {
            if (nextActiveSession.id !== selectedSessionId) {
                updateQuery({ sessionId: nextActiveSession.id, messagePage: "1" });
            }
            await loadMessages(nextActiveSession.id, nextActiveSession.status, messagePage);
        } else {
            setActiveSessionId(null);
            setActiveSessionStatus(null);
            setMessages([]);
            setMessagesMeta(null);
        }

        setIsLoading(false);
    }, [activeSessionId, isAdminMode, loadMessages, messagePage, selectedSessionId, sessionPage, updateQuery]);

    useEffect(() => {
        void loadSessions();
    }, [loadSessions]);

    const handleOpenSession = async (session: ChatSession) => {
        updateQuery({ sessionId: session.id, messagePage: "1" });
        await loadMessages(session.id, session.status, 1);
    };

    const handleSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeSessionId || !inputText.trim() || activeSessionStatus !== "OPEN" || isSending) {
            return;
        }

        const cachedText = inputText.trim();
        setIsSending(true);
        setInputText("");

        const response = await sendMessage({
            chatSessionId: activeSessionId,
            content: cachedText,
        });

        if (!response.success) {
            toast.error(response.message || "Failed to send message");
            setInputText(cachedText);
            setIsSending(false);
            return;
        }

        await loadMessages(activeSessionId, "OPEN", messagePage);
        setSessions((prev) => prev.map((session) =>
            session.id === activeSessionId
                ? {
                    ...session,
                    updatedAt: new Date().toISOString(),
                    messages: [
                        {
                            id: `latest-${Date.now()}`,
                            senderId: currentUserId,
                            content: cachedText,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                }
                : session,
        ));
        setIsSending(false);
    };

    const handleCloseChat = async () => {
        if (!activeSessionId || activeSessionStatus !== "OPEN") return;

        setIsClosing(true);
        const response = await updateSessionStatus(activeSessionId, "RESOLVED");
        if (!response.success) {
            toast.error(response.message || "Failed to close chat");
            setIsClosing(false);
            return;
        }

        setActiveSessionStatus("RESOLVED");
        setSessions((prev) => prev.map((session) =>
            session.id === activeSessionId ? { ...session, status: "RESOLVED" } : session,
        ));
        toast.success("Chat closed");
        setIsClosing(false);
    };

    return (
        // flex column: header shrinks to content, grid takes all remaining height
        <div className="flex h-[calc(100dvh-10rem)] flex-col gap-6">
            <div className="shrink-0 space-y-1">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <MessageSquare className="size-6" />
                    {isAdminMode ? "Chat Management" : "Closed Chats"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isAdminMode
                        ? "Review, reply to, and close support conversations from the existing dashboard sidebar."
                        : "Browse your resolved support conversations. Active chats remain available in the bottom-right widget."}
                </p>
            </div>

            {/* Grid fills remaining height; min-h-0 lets flex children shrink below content size */}
            <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

                {/* Sessions list — header fixed, list scrolls */}
                <Card className="flex min-h-0 flex-col overflow-hidden">
                    <CardHeader className="shrink-0">
                        <CardTitle>{isAdminMode ? "Sessions" : "Resolved Sessions"}</CardTitle>
                        <CardDescription>
                            {filteredSessions.length} conversation{filteredSessions.length === 1 ? "" : "s"}
                        </CardDescription>
                        {isAdminMode && (
                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant={sessionFilter === "ALL" ? "default" : "outline"} onClick={() => setSessionFilter("ALL")}>All</Button>
                                <Button size="sm" variant={sessionFilter === "OPEN" ? "default" : "outline"} onClick={() => setSessionFilter("OPEN")}>Open</Button>
                                <Button size="sm" variant={sessionFilter === "RESOLVED" ? "default" : "outline"} onClick={() => setSessionFilter("RESOLVED")}>Closed</Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="min-h-0 flex-1 overflow-y-auto space-y-2 p-4">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RefreshCw className="size-4 animate-spin" /> Loading chats...
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No chats found for this view.
                            </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <button
                                    key={session.id}
                                    type="button"
                                    onClick={() => handleOpenSession(session)}
                                    className={`w-full rounded-lg border px-3 py-3 text-left transition-colors hover:bg-muted/50 ${session.id === activeSessionId ? "border-primary bg-primary/5" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{getDisplayName(session)}</p>
                                            <p className="truncate text-xs text-muted-foreground">{session.user?.email || "No email available"}</p>
                                        </div>
                                        <span className={`text-[11px] font-medium ${session.status === "OPEN" ? "text-green-600" : "text-muted-foreground"}`}>
                                            {session.status === "RESOLVED" ? "Closed" : "Open"}
                                        </span>
                                    </div>
                                    <p className="mt-2 truncate text-xs text-muted-foreground">
                                        {session.messages?.[0]?.content || "No messages yet"}
                                    </p>
                                </button>
                            ))
                        )}
                        {sessionsMeta && (
                            <QueryPagination currentPage={sessionsMeta.page} totalPages={sessionsMeta.totalPages} totalItems={sessionsMeta.total} className="px-0" />
                        )}
                    </CardContent>
                </Card>

                {/* Conversation — header fixed, messages scroll, footer fixed */}
                <Card className="flex min-h-0 flex-col overflow-hidden">
                    <CardHeader className="shrink-0 border-b">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle>
                                    {activeSessionId
                                        ? sessions.find((session) => session.id === activeSessionId)?.user?.name || "Conversation"
                                        : "Conversation"}
                                </CardTitle>
                                <CardDescription>
                                    {activeSessionStatus === "RESOLVED"
                                        ? "This chat is closed and read-only."
                                        : activeSessionStatus === "OPEN"
                                            ? "Open chat"
                                            : "Select a chat from the sidebar list."}
                                </CardDescription>
                            </div>
                            {isAdminMode && activeSessionStatus === "OPEN" && (
                                <Button onClick={handleCloseChat} disabled={isClosing}>
                                    <CheckCircle2 className="mr-2 size-4" />
                                    {isClosing ? "Closing..." : "Close Chat"}
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                        {/* Scrollable messages area */}
                        <div ref={scrollContainerRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                            {!activeSessionId ? (
                                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                    <div className="space-y-2">
                                        <Inbox className="mx-auto size-10 opacity-30" />
                                        <p>Select a chat to view the conversation.</p>
                                    </div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                    <div className="space-y-2">
                                        <Inbox className="mx-auto size-10 opacity-30" />
                                        <p>No messages in this chat yet.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const isOwnMessage = message.senderId === currentUserId;
                                    return (
                                        <div key={message.id} className={`flex gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                            {!isOwnMessage && (
                                                <Avatar className="mt-1 size-8">
                                                    <AvatarImage src={message.sender?.image ?? ""} alt={message.sender?.name || "User"} />
                                                    <AvatarFallback>{message.sender?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${isOwnMessage ? "bg-primary text-primary-foreground" : "border bg-card"}`}>
                                                {message.imageUrl && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={message.imageUrl} alt="Chat attachment" className="mb-2 max-h-64 w-full rounded-md object-cover" />
                                                )}
                                                {message.content && <p className="wrap-break-word whitespace-pre-wrap">{message.content}</p>}
                                                <p className="mt-2 text-[11px] opacity-70">
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Fixed footer: pagination + input */}
                        {activeSessionId && messagesMeta && (
                            <QueryPagination
                                currentPage={messagesMeta.page}
                                totalPages={messagesMeta.totalPages}
                                totalItems={messagesMeta.total}
                                paramName="messagePage"
                                className="shrink-0 border-t px-4"
                            />
                        )}
                        {isAdminMode && activeSessionStatus === "OPEN" && (
                            <form onSubmit={handleSendMessage} className="shrink-0 border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={inputText}
                                        onChange={(event) => setInputText(event.target.value)}
                                        placeholder="Write a reply..."
                                        disabled={isSending}
                                    />
                                    <Button type="submit" disabled={!inputText.trim() || isSending}>
                                        <Send className="size-4" />
                                    </Button>
                                </div>
                            </form>
                        )}
                        {activeSessionStatus === "RESOLVED" && (
                            <div className="shrink-0 border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                                This conversation is closed. Sending is disabled for closed chats.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardChatPage;