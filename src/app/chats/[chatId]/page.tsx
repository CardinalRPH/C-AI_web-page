"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaImage, FaPaperPlane, FaBars } from 'react-icons/fa6';
import { messageType } from '../dto';
import MessageCard from '../components/MessageCard';
import Sidebar from '../components/Sidebar';

const ChatDetailPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatId = params.id as string;
    const isInitial = searchParams.get('init');
    const firstMsg = searchParams.get('msg');

    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    // 1. Efek untuk menangani "Pesan Pertama" saat baru redirect dari /chats
    useEffect(() => {
        if (isInitial && firstMsg && chatId) {
            // Bersihkan URL agar tidak trigger ulang saat refresh
            window.history.replaceState(null, '', `/chats/${chatId}`);
            processMessage(firstMsg);
        } else if (chatId) {
            // Jika bukan chat baru, ambil history dari database
            fetchChatHistory(chatId);
        }
    }, [chatId]);

    // 2. Fungsi ambil data lama dari API
    const fetchChatHistory = async (id: string) => {
        try {
            const res = await fetch(`/api/chats/${id}`);
            const data = await res.json();
            if (data.messages) setMessages(data.messages);
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    };

    // 3. Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const processMessage = async (text: string) => {
        if (isStreaming) return;
        setIsStreaming(true);

        const userMsgId = Date.now();
        const aiMsgId = userMsgId + 1;

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

    const handleFetch = async (targetId: number, prompt: string) => {
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
        if (!input.trim()) return;
        processMessage(input);
    };

    return (
        <div className="flex h-screen bg-[#131314] text-gray-200 font-sans">
            {/* Sidebar & Header tetap sama seperti sebelumnya */}
            <Sidebar isSidebarOpen={isSidebarOpen} chatHistory={[]} />

            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-[#282a2c] rounded-full transition-colors">
                        <FaBars className="text-xl" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-medium">C</span>
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white font-bold">AI</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">RF</div>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth">
                    <div className="max-w-3xl mx-auto py-8 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <MessageCard key={`msg-${msg.id}`} msg={msg} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-linear-to-t from-[#131314] via-[#131314] to-transparent">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="bg-[#1e1f20] rounded-3xl p-2 pl-6 flex items-end gap-2 border border-transparent focus-within:border-gray-600 transition-all shadow-xl">
                            <textarea
                                rows={1}
                                placeholder="Message C-AI..."
                                className="flex-1 bg-transparent border-none outline-none py-3 resize-none max-h-40 text-[15px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            />
                            <div className="flex items-center pb-2 gap-1">
                                <button onClick={handleSend} disabled={!input.trim() || isStreaming} className={`p-3 rounded-full transition-colors ${input.trim() ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatDetailPage;