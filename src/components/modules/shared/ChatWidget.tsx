"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Image as ImageIcon, CheckCircle2, Inbox, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    createSession, 
    getMySessions, 
    getAdminSessions, 
    getSessionMessages, 
    sendMessage, 
    updateSessionStatus 
} from "@/services/chat.services";
import { getUserInfo } from "@/services/auth.services";

type ViewState = "LOGIN_REQUIRED" | "LOADING" | "SESSION_LIST" | "CHAT";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [viewState, setViewState] = useState<ViewState>("LOADING");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [activeSessionStatus, setActiveSessionStatus] = useState<"OPEN" | "RESOLVED" | null>(null);
    
    // Admin state
    const [sessions, setSessions] = useState<any[]>([]);
    const [sessionFilter, setSessionFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");
    
    // Active chat state
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, viewState]);

    const initializeChat = useCallback(async () => {
        setViewState("LOADING");
        const user = await getUserInfo();
        if (!user) {
            setViewState("LOGIN_REQUIRED");
            return;
        }

        setUserRole(user.role);
        setUserId(user.id);

        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            // Fetch all sessions
            const res = await getAdminSessions();
            if (res.success) {
                setSessions(res.data);
                setActiveSessionStatus(null);
                setViewState("SESSION_LIST");
            }
        } else {
            // User: create or get active session
            const res = await createSession();
            if (res.success && res.data) {
                setActiveSessionId(res.data.id);
                setActiveSessionStatus(res.data.status);
                loadMessages(res.data.id);
                setViewState("CHAT");
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            initializeChat();
        }
    }, [isOpen, initializeChat]);

    const loadMessages = async (sessionId: string) => {
        const res = await getSessionMessages(sessionId);
        if (res.success) {
            setMessages(res.data);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent, imageStr?: string) => {
        e?.preventDefault();
        if ((!inputText.trim() && !imageStr) || !activeSessionId || isSending || activeSessionStatus !== "OPEN") return;

        setIsSending(true);
        const textCache = inputText;
        setInputText("");

        const res = await sendMessage({
            chatSessionId: activeSessionId,
            content: textCache,
            imageUrl: imageStr
        });

        if (res.success) {
            await loadMessages(activeSessionId);
            if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
                const refreshedSessions = await getAdminSessions();
                if (refreshedSessions.success) {
                    setSessions(refreshedSessions.data);
                }
            }
        } else {
            // Restore if failed
            setInputText(textCache);
        }
        setIsSending(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleSendMessage(undefined, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openAdminSession = (sessionId: string) => {
        const selectedSession = sessions.find((session) => session.id === sessionId);
        setActiveSessionId(sessionId);
        setActiveSessionStatus(selectedSession?.status ?? null);
        setViewState("CHAT");
        loadMessages(sessionId);
    };

    const resolveSession = async () => {
        if (!activeSessionId || activeSessionStatus !== "OPEN") return;
        const result = await updateSessionStatus(activeSessionId, "RESOLVED");
        if (!result.success) {
            return;
        }

        setActiveSessionStatus("RESOLVED");
        setSessions((prev) => prev.map((session) =>
            session.id === activeSessionId ? { ...session, status: "RESOLVED" } : session,
        ));
    };

    const filteredSessions = sessions.filter((session) => {
        if (sessionFilter === "ALL") return true;
        return session.status === sessionFilter;
    });

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="h-125 w-80 sm:w-96 flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
                    <CardHeader className="bg-primary/10 py-3 border-b flex flex-row items-center justify-between space-y-0 relative">
                        <div className="flex items-center gap-2">
                            {viewState === "CHAT" && (userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                                <Button variant="ghost" size="icon" className="size-6 mr-1" onClick={() => setViewState("SESSION_LIST")}>
                                    <ArrowLeft className="size-4" />
                                </Button>
                            )}
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <MessageCircle className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-md">Customer Support</CardTitle>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    {viewState === "LOADING" ? "Connecting..." : "Online"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {viewState === "CHAT" && activeSessionStatus === "OPEN" && (
                                <Button title="Resolve Chat" variant="ghost" size="icon" className="size-8 text-green-600 hover:bg-green-100" onClick={resolveSession}>
                                    <CheckCircle2 className="size-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="size-8 shrink-0 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="size-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                        {viewState === "LOADING" && (
                            <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                                <RefreshCw className="size-6 animate-spin" />
                                <span>Loading chat...</span>
                            </div>
                        )}

                        {viewState === "LOGIN_REQUIRED" && (
                            <div className="h-full flex items-center justify-center text-center text-muted-foreground px-4">
                                <p>You must be logged in to chat with support.</p>
                            </div>
                        )}

                        {viewState === "SESSION_LIST" && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pb-2">
                                    <Button size="sm" variant={sessionFilter === "ALL" ? "default" : "outline"} onClick={() => setSessionFilter("ALL")}>All</Button>
                                    <Button size="sm" variant={sessionFilter === "OPEN" ? "default" : "outline"} onClick={() => setSessionFilter("OPEN")}>Open</Button>
                                    <Button size="sm" variant={sessionFilter === "RESOLVED" ? "default" : "outline"} onClick={() => setSessionFilter("RESOLVED")}>Closed</Button>
                                </div>
                                {filteredSessions.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground mt-10">No active sessions.</p>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead className="bg-muted/70">
                                                <tr>
                                                    <th className="text-left px-2 py-2">User</th>
                                                    <th className="text-left px-2 py-2">Latest</th>
                                                    <th className="text-left px-2 py-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSessions.map((session) => (
                                                    <tr
                                                        key={session.id}
                                                        onClick={() => openAdminSession(session.id)}
                                                        className="cursor-pointer border-t hover:bg-muted/40"
                                                    >
                                                        <td className="px-2 py-2 font-medium">{session.user?.name || "User"}</td>
                                                        <td className="max-w-35 truncate px-2 py-2 text-muted-foreground">{session.messages?.[0]?.content || "No messages"}</td>
                                                        <td className="px-2 py-2">
                                                            <span className={session.status === "OPEN" ? "text-green-600" : "text-gray-500"}>
                                                                {session.status === "RESOLVED" ? "CLOSED" : session.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {viewState === "CHAT" && (
                            (userRole === "ADMIN" || userRole === "SUPER_ADMIN") ? (
                                <div className="grid grid-cols-12 gap-3 h-full">
                                    <div className="col-span-4 border rounded-md overflow-y-auto bg-card">
                                        {filteredSessions.map((session) => (
                                            <button
                                                key={session.id}
                                                type="button"
                                                onClick={() => openAdminSession(session.id)}
                                                className={`w-full text-left px-2 py-2 border-b hover:bg-muted/50 ${session.id === activeSessionId ? "bg-muted" : ""}`}
                                            >
                                                <p className="text-xs font-semibold truncate">{session.user?.name || "User"}</p>
                                                <p className="text-[11px] text-muted-foreground truncate">{session.messages?.[0]?.content || "No messages"}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="col-span-8 overflow-y-auto pr-1">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={`flex gap-2 mb-2 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                                {msg.senderId !== userId && (
                                                    <Avatar className="size-7 mt-1">
                                                        <AvatarImage src={msg.sender?.image ?? ""} />
                                                        <AvatarFallback className="text-[10px]">{msg.sender?.name?.[0] ?? "U"}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.senderId === userId ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card border shadow-sm rounded-bl-none"}`}>
                                                    {msg.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={msg.imageUrl} alt="uploaded" className="max-w-full rounded-md mb-2 object-cover" />
                                                    )}
                                                    {msg.content && <p className="text-sm wrap-break-word whitespace-pre-wrap">{msg.content}</p>}
                                                    <span className="text-[10px] opacity-70 mt-1 block">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-2 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                        {msg.senderId !== userId && (
                                            <Avatar className="size-7 mt-1">
                                                <AvatarImage src={msg.sender?.image ?? ""} />
                                                <AvatarFallback className="text-[10px]">{msg.sender?.name?.[0] ?? "U"}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`max-w-[80%] rounded-2xl p-3 ${msg.senderId === userId ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card border shadow-sm rounded-bl-none"}`}>
                                            {msg.imageUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={msg.imageUrl} alt="uploaded" className="max-w-full rounded-md mb-2 object-cover" />
                                            )}
                                            {msg.content && <p className="text-sm wrap-break-word whitespace-pre-wrap">{msg.content}</p>}
                                            <span className="text-[10px] opacity-70 mt-1 block">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                        {viewState === "CHAT" && messages.length === 0 && (
                            <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                                <Inbox className="size-10 opacity-20" />
                                <span className="text-sm">Start the conversation</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {viewState === "CHAT" && activeSessionStatus === "OPEN" && (
                        <CardFooter className="p-3 bg-background border-t">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
                                <Label htmlFor="chat-image-upload" className="cursor-pointer shrink-0">
                                    <div className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
                                        <ImageIcon className="size-5 text-muted-foreground" />
                                    </div>
                                    <input id="chat-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isSending}/>
                                </Label>
                                <Input 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="flex-1 rounded-full border-muted-foreground/20 focus-visible:ring-primary/50"
                                    disabled={isSending}
                                />
                                <Button type="submit" size="icon" className="shrink-0 rounded-full size-10" disabled={!inputText.trim() || isSending}>
                                    <Send className="size-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    )}
                    {viewState === "CHAT" && activeSessionStatus === "RESOLVED" && (
                        <CardFooter className="p-3 bg-background border-t text-sm text-muted-foreground">
                            This conversation is closed. Sending is disabled for closed chats.
                        </CardFooter>
                    )}
                </Card>
            ) : (
                <Button 
                    onClick={() => setIsOpen(true)} 
                    className="size-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 animate-bounce"
                >
                    <MessageCircle className="size-6 shadow-sm" />
                </Button>
            )}
        </div>
    );
}
