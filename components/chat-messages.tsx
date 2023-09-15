"use client"

import { Companion, Message } from "@prisma/client";

interface ChatMessagesProps {
    isLoading: boolean;
    companion: Companion
    messages: any[];
}

export const ChatMessages = ({ isLoading, companion, messages = [], }: ChatMessagesProps) => {

    return (
        <div>
            Chats
        </div>
    )
}