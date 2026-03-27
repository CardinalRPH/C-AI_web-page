
"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
    FaPlus,
    FaMessage,
    FaRegCompass,
    FaClockRotateLeft,
    FaGear,
    FaMicrophone,
    FaImage,
    FaPaperPlane,
    FaBars
} from 'react-icons/fa6';

const ChatPage = () => {
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Halo! Ada yang bisa saya bantu hari ini?' }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;

        // Tambah pesan user
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        // Simulasi respons AI
        setTimeout(() => {
            setMessages([...newMessages, { role: 'ai', content: 'Ini adalah contoh respons simulasi dari AI.' }]);
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-[#131314] text-gray-200 font-sans">

            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} transition-all duration-300 bg-[#1e1f20] flex flex-col`}>
                <div className="p-4">
                    <button className="flex items-center gap-3 px-4 py-3 bg-[#1a1c1e] hover:bg-[#282a2c] rounded-full text-sm transition-colors mb-8">
                        <FaPlus className="text-lg" />
                        {isSidebarOpen && <span>Chat Baru</span>}
                    </button>

                    <div className="space-y-2">
                        <p className="px-4 text-xs font-semibold text-gray-400 mb-2">Terbaru</p>
                        <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm text-left truncate">
                            <FaMessage className="text-gray-400" />
                            <span className="truncate">Struktur Data React</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto p-4 space-y-2">
                    <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm"><FaRegCompass /> Bantuan</button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm"><FaClockRotateLeft /> Aktivitas</button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm"><FaGear /> Setelan</button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">

                {/* Header */}
                <header className="p-4 flex justify-between items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 hover:bg-[#282a2c] rounded-full transition-colors"
                    >
                        <FaBars className="text-xl" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-medium">Gemini</span>
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white">Pro</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                        RF
                    </div>
                </header>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto px-4 md:px-0">
                    <div className="max-w-3xl mx-auto py-8 space-y-8">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center">
                                        G
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 ${msg.role === 'user' ? 'bg-[#282a2c] rounded-2xl px-5' : 'leading-relaxed'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-linear-to-t from-[#131314] via-[#131314] to-transparent">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="bg-[#1e1f20] rounded-3xl p-2 pl-6 flex items-end gap-2 border border-transparent focus-within:border-gray-600 transition-all">
                            <textarea
                                rows={1}
                                placeholder="Ketik sesuatu di sini..."
                                className="flex-1 bg-transparent border-none outline-none py-3 resize-none max-h-40"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            />
                            <div className="flex items-center pb-2 gap-1">
                                <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400 transition-colors">
                                    <FaImage />
                                </button>
                                <button className="p-3 hover:bg-[#282a2c] rounded-full text-blue-400 transition-colors">
                                    <FaMicrophone />
                                </button>
                                {input && (
                                    <button
                                        onClick={handleSend}
                                        className="p-3 hover:bg-[#282a2c] rounded-full text-white transition-colors"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-center mt-3 text-gray-500">
                            AI dapat menampilkan info yang tidak akurat, termasuk tentang orang, jadi periksa kembali responsnya.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ChatPage;