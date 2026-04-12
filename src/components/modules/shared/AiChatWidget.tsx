"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendAiMessage, AiChatMessage } from "@/services/ai.services";

export default function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AiChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage: AiChatMessage = { role: "user", content: inputText.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputText("");
        setIsLoading(true);

        const res = await sendAiMessage(updatedMessages);

        if (res.success && res.data) {
            setMessages([...updatedMessages, { role: "assistant", content: res.data.reply }]);
        } else {
            setMessages([
                ...updatedMessages,
                { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." },
            ]);
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setMessages([]);
        setInputText("");
    };

    return (
        <div className="fixed bottom-6 right-24 z-50">
            {isOpen ? (
                <Card className="h-125 w-80 sm:w-96 flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
                    <CardHeader className="bg-primary/10 py-3 border-b flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <Bot className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-md">CineBot</CardTitle>
                                <p className="text-xs text-muted-foreground">AI assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                title="New conversation"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={handleReset}
                            >
                                <RefreshCw className="size-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 rounded-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="size-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                        {messages.length === 0 && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3 px-4">
                                <Bot className="size-10 opacity-20" />
                                <p className="text-sm">
                                    Hi! I&apos;m CineBot. Ask me anything about CineTube — movies, subscriptions, features, and more.
                                </p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <Avatar className="size-7 mt-1 shrink-0">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                                            AI
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap break-words ${
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-card border shadow-sm rounded-bl-none"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-2 justify-start">
                                <Avatar className="size-7 mt-1 shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                                        AI
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-card border shadow-sm rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </CardContent>

                    <CardFooter className="p-3 bg-background border-t">
                        <form onSubmit={handleSend} className="flex items-center gap-2 w-full">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask CineBot..."
                                className="flex-1 rounded-full border-muted-foreground/20 focus-visible:ring-primary/50"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="shrink-0 rounded-full size-10"
                                disabled={!inputText.trim() || isLoading}
                            >
                                <Send className="size-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="size-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                    title="Ask CineBot"
                >
                    <Bot className="size-6" />
                </Button>
            )}
        </div>
    );
}
