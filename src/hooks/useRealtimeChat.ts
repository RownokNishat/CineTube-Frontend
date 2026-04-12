'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface RealtimeChatMessage {
    id: string;
    chatSessionId?: string;
    senderId: string;
    content?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        role?: string;
        image?: string | null;
    };
}

export function useRealtimeChat(sessionId: string, initialMessages: RealtimeChatMessage[]) {
    const [messages, setMessages] = useState<RealtimeChatMessage[]>(initialMessages);

    // Sync initial messages when they change (e.g. after REST fetch completes)
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase
            .channel(`chat:${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'ChatMessage',
                    filter: `chatSessionId=eq.${sessionId}`,
                },
                (payload) => {
                    const newMessage = payload.new as RealtimeChatMessage;
                    setMessages((prev) => {
                        // Avoid duplicates if REST and realtime race
                        if (prev.some((m) => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    return { messages, setMessages };
}
