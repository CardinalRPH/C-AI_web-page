import { prisma } from "@/libs/prisma"

export const buildOllamaMessage = async (sessionId: string) => {
    const lastMessages = await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
        take: 20
    });

    // ambil summary
    const session = await prisma.chatSession.findUnique({
        where: { id: sessionId }
    });

    const systemPrompt = {
        role: "system",
        content: "Kamu adalah AI assistant yang ramah, santai, dan membantu."
    };

    const summaryPrompt = session?.summary
        ? {
            role: "system",
            content: `Summary percakapan sebelumnya: ${session.summary}`
        }
        : null;

    const formattedMessages = lastMessages.map((msg) => ({
        role: msg.role === "ASSISTANT" ? "assistant" : "user",
        content: msg.content
    }));

    return [
        systemPrompt,
        ...(summaryPrompt ? [summaryPrompt] : []),
        ...formattedMessages
    ];
}