"use client"

import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import Sidebar from './components/Sidebar';
import { useGetChatHistory } from '@/hooks/messageHook';
import { useParams } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { data } = useGetChatHistory();
    const { chatId } = useParams();

    return (
        <div className="flex h-screen bg-[#131314] text-gray-200 font-sans">
            <Sidebar isSidebarOpen={isSidebarOpen} chatHistory={data?.data || []} chatId={chatId as string} />

            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="p-4 flex justify-between items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 hover:bg-[#282a2c] rounded-full transition-colors"
                    >
                        <FaBars className="text-xl" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-medium">C</span>
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white font-bold">AI</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                        RF
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}