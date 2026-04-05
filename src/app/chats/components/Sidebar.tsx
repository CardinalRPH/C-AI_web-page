"use client"

import { FaGear, FaPlus, FaRegCompass } from "react-icons/fa6"
import { chatHistoryType } from "../dto"
import SideChatHistory from "./SideChatHistory"
import Link from "next/link"

const Sidebar = ({ isSidebarOpen, chatHistory, chatId }: { isSidebarOpen: boolean, chatHistory: chatHistoryType[], chatId?: string }) => {
    return (
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} transition-all duration-300 bg-[#1e1f20] flex flex-col h-screen`}>
            {chatId ? (
                <div className="p-4 flex-none">
                    <Link href={"/chats"} className="flex items-center gap-3 px-4 py-3 bg-[#1a1c1e] hover:bg-[#282a2c] rounded-full text-sm transition-colors mb-4 w-fit">
                        <FaPlus className="text-lg" />
                        {isSidebarOpen && <span>New Chat</span>}
                    </Link>
                </div>
            ) : <div className="p-4 flex-none">
                </div>}
            <div className="flex-1 overflow-y-auto px-4">
                {isSidebarOpen && (
                    <div className="space-y-2">
                        <p className="px-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Newest</p>
                        <div className="space-y-1">
                            {chatHistory.map((data) => (
                                <SideChatHistory key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Bagian Bawah Sidebar */}
            <div className="mt-auto p-4 space-y-2 flex-none border-t border-gray-800/50">
                <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm text-gray-300"><FaRegCompass /> {isSidebarOpen && "Help"}</button>
                <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm text-gray-300"><FaGear /> {isSidebarOpen && "Settings"}</button>
            </div>
        </aside>
    )
}

export default Sidebar