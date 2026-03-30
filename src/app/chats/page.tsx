"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan ini
import {
    FaMicrophone, FaImage, FaPaperPlane, FaBars
} from 'react-icons/fa6';
import Sidebar from './components/Sidebar';
import { chatHistoryType, messageType } from './dto';
import MessageCard from './components/MessageCard';



const chatHistory: chatHistoryType[] = [
    {
        id: "1",
        title: "Introduction to AI Chat",
        linkTo: "/chat/1"
    },
    {
        id: "2",
        title: "Debugging Node.js API",
        linkTo: "/chat/2"
    },
    {
        id: "3",
        title: "Next.js Routing Guide",
        linkTo: "/chat/3"
    },
    {
        id: "4",
        title: "Integrate Ollama with Backend",
        linkTo: "/chat/4"
    },
    {
        id: "5",
        title: "Database Schema Discussion",
        linkTo: "/chat/5"
    },
    {
        id: "6",
        title: "Authentication Flow Setup",
        linkTo: "/chat/6"
    },
    {
        id: "7",
        title: "UI Improvements and Layout",
        linkTo: "/chat/7"
    }
];

const ChatPage = () => {
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [messages, setMessages] = useState<messageType[]>([
        { role: 'ASSISTANT', content: 'Halo! Ada yang bisa saya bantu hari ini?', isNew: false, id: -1 },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll ke bawah saat pesan bertambah
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsgId = Date.now();
        const aiMsgId = userMsgId + 1;

        // 1. Tambah pesan user & placeholder untuk AI
        const userMsg: messageType = {
            role: 'USER',
            content: input,
            isNew: true,
            id: userMsgId
        };

        const aiPlaceholder: messageType = {
            role: 'ASSISTANT',
            content: '', // Kosong dulu
            isNew: true,
            id: aiMsgId
        };

        setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
        const currentInput = input;
        setInput('');

        // 2. Jalankan Fetch Stream
        await handleFetch(aiMsgId, currentInput);
    };

    // Gunakan TextDecoderStream untuk hasil yang lebih stabil
    const handleFetch = async (targetId: number, prompt: string) => {
        try {
            const res = await fetch("/api/ai-stream", {
                method: "POST",
                body: JSON.stringify({ prompt })
            });

            if (!res.body) return;

            const reader = res.body
                .pipeThrough(new TextDecoderStream()) // Ini sangat membantu mencegah karakter aneh
                .getReader();

            let fullContent = ""; // Penampung lokal

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 'value' di sini sudah berupa string karena pipeThrough(new TextDecoderStream())
                fullContent += value;

                // Gunakan functional update agar tidak mengambil state yang 'stale' (basi)
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === targetId
                            ? { ...msg, content: fullContent }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error("Streaming error:", error);
        }
    };

    return (
        <div className="flex h-screen bg-[#131314] text-gray-200 font-sans">

            <Sidebar isSidebarOpen={isSidebarOpen} chatHistory={chatHistory} />


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

                <div className="p-4 bg-linear-to-t from-[#131314] via-[#131314] to-transparent">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="bg-[#1e1f20] rounded-3xl p-2 pl-6 flex items-end gap-2 border border-transparent focus-within:border-gray-600 transition-all shadow-xl">
                            <textarea
                                rows={1}
                                placeholder="Ask something..."
                                className="flex-1 bg-transparent border-none outline-none py-3 resize-none max-h-40 text-[15px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            />
                            <div className="flex items-center pb-2 gap-1">
                                <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400 transition-colors"><FaImage /></button>
                                <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400 transition-colors"><FaMicrophone /></button>
                                {input && (
                                    <button onClick={handleSend} className="p-3 hover:bg-[#282a2c] rounded-full text-white transition-colors bg-blue-600/20"><FaPaperPlane /></button>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-center mt-3 text-gray-500 italic">
                            C-AI cant make mistakes
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;