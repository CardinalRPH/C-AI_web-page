"use client"

import Link from "next/link"
import { FaMessage } from "react-icons/fa6"
import { chatHistoryType } from "../dto"

const SideChatHistory = ({ data }: { data: chatHistoryType }) => {
    return (
        <Link key={data.id} href={data.linkTo} className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 hover:bg-[#282a2c] rounded-full text-sm text-left transition-colors group">
            <FaMessage className="text-gray-400 group-hover:text-white" />
            <span className="truncate text-gray-300 group-hover:text-white">{data.title}</span>
        </Link>
    )
}

export default SideChatHistory