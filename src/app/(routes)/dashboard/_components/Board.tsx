"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    MessageScrollerProvider,
    MessageScroller,
    MessageScrollerViewport,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerButton,
} from "@/components/ui/message-scroller";
import {
    MessageGroup,
    Message,
    MessageAvatar,
    MessageContent,
    MessageHeader,
    MessageFooter,
} from "@/components/ui/message";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageType {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function Board() {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || isStreaming) return;

        const userMessage: MessageType = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!res.ok) throw new Error("Failed to connect to chat service");

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error("Response body is empty");

            setIsLoading(false);
            setIsStreaming(true);

            const assistantMessage: MessageType = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessage.id
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error("Error streaming message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content:
                        "Sorry, there was an error processing your request. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col gap-2">
            <div className="flex items-center justify-between px-6">
                <div>
                    <h1 className="font-heading text-2xl font-semibold">Chat</h1>
                    <p className="text-muted-foreground text-sm">Ask me anything</p>
                </div>
            </div>

            <div className="flex-1 mx-24 min-h-0 rounded-2xl border border-border bg-card overflow-hidden">
                <MessageScrollerProvider>
                    <MessageScroller className="h-full">
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="gap-0">
                                {messages.length === 0 && (
                                    <div className="flex flex-1 h-full items-center justify-center text-muted-foreground">
                                        Start a conversation
                                    </div>
                                )}
                                {messages.map((message) => (
                                    <MessageScrollerItem key={message.id}>
                                        <MessageGroup>
                                            <Message className="px-2" align={message.role === "user" ? "end" : "start"}>
                                                <MessageAvatar>
                                                    <Avatar size="sm">
                                                        <AvatarFallback>
                                                            {message.role === "user" ? (
                                                                <User className="size-3.5" />
                                                            ) : (
                                                                <Bot className="size-3.5" />
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </MessageAvatar>
                                                <MessageContent className="">
                                                    <MessageHeader>
                                                        {message.role === "user" ? "You" : "Assistant"}
                                                    </MessageHeader>
                                                    <div className="rounded-2xl bg-muted/50 px-4 py-2.5 text-sm">
                                                        {message.content}
                                                    </div>
                                                    <MessageFooter>
                                                        {message.timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </MessageFooter>
                                                </MessageContent>
                                            </Message>
                                        </MessageGroup>
                                    </MessageScrollerItem>
                                ))}
                                {isLoading && (
                                    <MessageScrollerItem>
                                        <MessageGroup>
                                            <Message align="start">
                                                <MessageAvatar>
                                                    <Avatar size="sm">
                                                        <AvatarFallback>
                                                            <Bot className="size-3.5" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </MessageAvatar>
                                                <MessageContent>
                                                    <MessageHeader>Assistant</MessageHeader>
                                                    <div className="rounded-2xl bg-muted/50 px-4 py-2.5">
                                                        <Spinner className="size-4" />
                                                    </div>
                                                </MessageContent>
                                            </Message>
                                        </MessageGroup>
                                    </MessageScrollerItem>
                                )}
                                <div ref={messagesEndRef} />
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                        <MessageScrollerButton direction="end" />
                    </MessageScroller>
                </MessageScrollerProvider>
            </div>

            <div className="flex mx-22 gap-2 pb-2 px-2">
                <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="max-h-32"
                    disabled={isLoading || isStreaming}
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || isStreaming}
                    size="icon"
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
}
