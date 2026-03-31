"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { FaCircleExclamation, FaXmark } from 'react-icons/fa6';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

const ErrorModal = ({ isOpen, onClose, title = "Action Failed", message }: ErrorModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-sm bg-[#1e1f20] border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Red Accent Bar */}
                        <div className="h-1.5 w-full bg-red-600" />

                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-red-600/10 rounded-2xl">
                                    <FaCircleExclamation className="text-2xl text-red-500" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-white"
                                >
                                    <FaXmark />
                                </button>
                            </div>

                            <div className="mt-5">
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {title}
                                </h3>
                                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ErrorModal;