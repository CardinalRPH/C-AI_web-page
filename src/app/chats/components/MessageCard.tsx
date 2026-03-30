"use client"

import { messageType } from "../dto";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageCard = ({ msg }: { msg: messageType }) => {
    const isAi = msg.role === "ASSISTANT";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === "USER" ? 'justify-end' : 'justify-start'}`}
        >
            {isAi && (
                <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center font-bold text-xs shadow-lg">
                    C
                </div>
            )}

            <div className={`max-w-[85%] p-3 ${msg.role === "USER" ? 'bg-[#282a2c] rounded-2xl px-5' : 'w-full'}`}>
                <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="my-4 rounded-lg overflow-hidden border border-gray-700">
                                        <div className="bg-[#1e1e1e] px-4 py-1.5 text-xs text-gray-400 flex justify-between items-center border-b border-gray-700">
                                            <span>{match[1]}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                className="hover:text-white transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                padding: '1rem',
                                                fontSize: '0.85rem',
                                                background: '#131314',
                                            }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className="bg-[#2d2e30] px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                            a: ({ children, href }) => <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }}
                    >
                        {msg.content}
                    </ReactMarkdown>
                </div>

                {isAi && !msg.content && (
                    <div className="flex gap-1.5 py-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageCard;