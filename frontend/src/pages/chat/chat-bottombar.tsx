import {
    FileImage,
    Mic,
    Paperclip,
    PlusCircle,
    SendHorizontal,
    ThumbsUp,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData } from "@/data";
import {Emoji}
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {ChatInput} from "@/components/ui/chat/chat-input.tsx";
import useChatStore from "@/hooks/useChatStore";

const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ isMobile }) {
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);
    const setMessages = useChatStore((state) => state.setMessages);
    const hasInitialResponse = useChatStore((state) => state.hasInitialResponse);
    const setHasInitialResponse = useChatStore((state) => state.setHasInitialResponse);
    const [isLoading, setisLoading] = useState(false);

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = (newMessage) => {
        useChatStore.setState((state) => ({
            messages: [...state.messages, newMessage],
        }));
    };

    const handleThumbsUp = () => {
        const newMessage = {
            id: message.length + 1,
            name: loggedInUserData.name,
            avatar: loggedInUserData.avatar,
            message: "👍",
        };
        sendMessage(newMessage);
        setMessage("");
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage = {
                id: message.length + 1,
                name: loggedInUserData.name,
                avatar: loggedInUserData.avatar,
                message: message.trim(),
            };
            sendMessage(newMessage);
            setMessage("");

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }

        if (!hasInitialResponse) {
            setisLoading(true);
            setTimeout(() => {
                setMessages((messages) => [
                    ...messages.slice(0, messages.length - 1),
                    {
                        id: messages.length + 1,
                        avatar:
                            "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
                        name: "Jane Doe",
                        message: "Awesome! I am just chilling outside.",
                    },
                ]);
                setisLoading(false);
                setHasInitialResponse(true);
            }, 2500);
        }
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + "\n");
        }
    };

    return (
        <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
            <div className="flex">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <PlusCircle size={22} className="text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-full p-2">
                        {message.trim() || isMobile ? (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Mic size={22} className="text-muted-foreground" />
                                </Button>
                                {BottombarIcons.map((icon, index) => (
                                    <Button key={index} variant="ghost" size="icon" className="h-9 w-9">
                                        <icon.icon size={22} className="text-muted-foreground" />
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Mic size={22} className="text-muted-foreground" />
                            </Button>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            <AnimatePresence>
                <motion.div className="w-full relative" layout>
                    <ChatInput
                        value={message}
                        ref={inputRef}
                        onKeyDown={handleKeyPress}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="rounded-full"
                    />
                    <div className="absolute right-4 bottom-2">
                        <EmojiPicker onChange={(value) => setMessage(message + value)} />
                    </div>
                </motion.div>

                {message.trim() ? (
                    <Button className="h-9 w-9" onClick={handleSend} disabled={isLoading} variant="ghost" size="icon">
                        <SendHorizontal size={22} className="text-muted-foreground" />
                    </Button>
                ) : (
                    <Button className="h-9 w-9" onClick={handleThumbsUp} disabled={isLoading} variant="ghost" size="icon">
                        <ThumbsUp size={22} className="text-muted-foreground" />
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
}
