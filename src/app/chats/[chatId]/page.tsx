"use client"
import { useParams } from 'next/navigation';
import ChatContainer from '../components/ChatContainer';

export default function DetailPage() {
    const { chatId } = useParams();
    return <ChatContainer chatId={chatId as string} />;
}