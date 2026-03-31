import { create } from 'zustand';

interface ChatState {
    pendingMessage: string | null;
    setPendingMessage: (msg: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    pendingMessage: null,
    setPendingMessage: (msg) => set({ pendingMessage: msg }),
}));