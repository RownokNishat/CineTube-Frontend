'use client';

import { useEffect, useRef, useState } from 'react';
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

export function useRealtimeChat(sessionId: string) {
    const [messages, setMessages] = useState<RealtimeChatMessage[]>([]);
    // Track whether a realtime message arrived (vs. a bulk load from REST)
    const realtimeArrived = useRef(false);

    // Clear messages immediately when switching to a different session
    useEffect(() => {
        setMessages([]);
        realtimeArrived.current = false;
    }, [sessionId]);

    useEffect(() => {
        if (!sessionId) return;

        // Table name is snake_case in the DB; column names remain camelCase
        const channel = supabase
            .channel(`chat:${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_message',           // ← snake_case table name
                    filter: `chatSessionId=eq.${sessionId}`,
                },
                (payload) => {
                    const newMessage = payload.new as RealtimeChatMessage;
                    realtimeArrived.current = true;
                    setMessages((prev) => {
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

    return { messages, setMessages, realtimeArrived };
}
