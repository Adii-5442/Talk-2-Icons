"use client"

import { Companion, Message } from "@prisma/client";
import { ChatMessage } from "./chat-message";

interface ChatMessagesProps {
    isLoading: boolean;
    companion: Companion
    messages: any[];
}

export const ChatMessages = ({ isLoading, companion, messages = [], }: ChatMessagesProps) => {

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                src={companion.src}
                role="system"
                content={`Hello I am ${companion.name} , ${companion.description}`}
            />
        </div>
    )
}