"use client"
import { ReactNode } from "react";

const FieldContainer = ({ children, title, icon, errrMsg }: { children: ReactNode, title: String, icon: ReactNode, errrMsg?: String | null }) => {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 ml-1">{title}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    {icon}
                </div>
                {children}
            </div>
            {errrMsg && <p className="text-xs ml-3 text-red-500">{errrMsg}</p>}
        </div>
    )
}

export default FieldContainer