"use client"

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6';
import MessageCard from './MessageCard';
import { messageType } from '../dto';
import { useChatStore } from '@/stores/useChatStore';
import { useGetMsgHistory, useSendFirstMsg } from '@/hooks/messageHook';

interface ChatContainerProps {
    chatId?: string; // Optional: Jika ada berarti di [chatId], jika tidak ada berarti di /chats
}

const ChatContainer = ({ chatId }: ChatContainerProps) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<messageType[]>([
        { role: 'ASSISTANT', content: 'Halo! Ada yang bisa saya bantu hari ini?', isNew: false, id: "-1" },
    ]);
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { pendingMessage, setPendingMessage } = useChatStore();
    const { mutate: sendFirst } = useSendFirstMsg();
    const { data, refetch } = useGetMsgHistory(chatId)

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        if (chatId && pendingMessage) {
            processMessage(pendingMessage);
            setPendingMessage(null);
        }
        if (chatId) {
            refetch()
        }
    }, [chatId]);

    useEffect(() => {
        if (data?.data) {
            setMessages(data.data)
        }
    }, [data?.data])

    const processMessage = async (text: string) => {
        if (!chatId) {
            setPendingMessage(text);
            sendFirst({ prompt: text });
            return;
        }

        setIsStreaming(true);
        const userMsgId = crypto.randomUUID();
        const aiMsgId = crypto.randomUUID()

        const userMsg: messageType = {
            role: 'USER',
            content: text,
            isNew: true,
            id: userMsgId
        };

        const aiPlaceholder: messageType = {
            role: 'ASSISTANT',
            content: '',
            isNew: true,
            id: aiMsgId
        };

        setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
        setInput('');

        await handleFetch(aiMsgId, text);
        setIsStreaming(false);
    };

    const handleFetch = async (targetId: string, prompt: string) => {
        try {
            const res = await fetch("/api/ai-stream", {
                method: "POST",
                body: JSON.stringify({ prompt, chatId }) // Kirim chatId agar backend bisa simpan history
            });

            if (!res.body) return;
            const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
            let fullContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullContent += value;

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === targetId ? { ...msg, content: fullContent } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Streaming error:", error);
        }
    };

    const handleSend = () => {
        if (!input.trim() || isStreaming) return;
        const currentInput = input;
        setInput('');
        processMessage(currentInput);
    };

    return (
        <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth">
                <div className="max-w-3xl mx-auto py-8 space-y-8">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <MessageCard key={`msg-${msg.id}`} msg={msg} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-4 bg-linear-to-t from-[#131314] via-[#131314] to-transparent">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="bg-[#1e1f20] rounded-3xl p-2 pl-6 flex items-end gap-2 border border-transparent focus-within:border-gray-600 transition-all shadow-xl">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Ask something..."
                            className="flex-1 bg-transparent border-none outline-none py-3 resize-none max-h-40 text-[15px]"
                        />
                        <div className="flex items-center pb-2 gap-1">
                            <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400"><FaImage /></button>
                            <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400"><FaMicrophone /></button>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming}
                                className={`p-3 rounded-full transition-colors ${input.trim() ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatContainer;