"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Image as ImageIcon, CheckCircle2, Inbox, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    
    // Admin state
    const [sessions, setSessions] = useState<any[]>([]);
    
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
                setViewState("SESSION_LIST");
            }
        } else {
            // User: create or get active session
            const res = await createSession();
            if (res.success && res.data) {
                setActiveSessionId(res.data.id);
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
        if ((!inputText.trim() && !imageStr) || !activeSessionId || isSending) return;

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
        setActiveSessionId(sessionId);
        setViewState("CHAT");
        loadMessages(sessionId);
    };

    const resolveSession = async () => {
        if (!activeSessionId) return;
        await updateSessionStatus(activeSessionId, "RESOLVED");
        // Admins go back to list, Users can stay or get a new session
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
            setViewState("SESSION_LIST");
            initializeChat();
        } else {
            initializeChat();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
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
                            {viewState === "CHAT" && (
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
                                {sessions.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground mt-10">No active sessions.</p>
                                ) : (
                                    sessions.map((session) => (
                                        <div 
                                            key={session.id} 
                                            onClick={() => openAdminSession(session.id)}
                                            className="p-3 bg-card border rounded-lg cursor-pointer hover:bg-muted transition-colors flex justify-between items-center"
                                        >
                                            <div className="overflow-hidden">
                                                <p className="font-semibold text-sm truncate">{session.user?.name || "User"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{session.messages?.[0]?.content || "No messages yet"}</p>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0 ml-2">
                                                <div className={`size-2 rounded-full ${session.status === "OPEN" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {viewState === "CHAT" && messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 ${msg.senderId === userId ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card border shadow-sm rounded-bl-none"}`}>
                                    {msg.imageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={msg.imageUrl} alt="uploaded" className="max-w-full rounded-md mb-2 object-cover" />
                                    )}
                                    {msg.content && <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1 px-1 flex items-center gap-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                    {msg.senderId === userId && <CheckCircle2 className="size-3 text-primary" />}
                                </span>
                            </div>
                        ))}
                        {viewState === "CHAT" && messages.length === 0 && (
                            <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                                <Inbox className="size-10 opacity-20" />
                                <span className="text-sm">Start the conversation</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {viewState === "CHAT" && (
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
