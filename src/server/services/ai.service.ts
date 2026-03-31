import { prisma } from "@/libs/prisma"

export const buildOllamaMessage = async (chatSessionId: string) => {
    const lastMessages = await prisma.message.findMany({
        where: { chatSessionId },
        orderBy: { createdAt: "asc" },
        take: 20
    });

    // ambil summary
    const session = await prisma.chatSession.findUnique({
        where: { id: chatSessionId }
    });

    const systemPrompt = {
        role: "system",
        content: "Kamu adalah AI assistant yang ramah, santai, dan membantu."
    };

    const formattedMessages = lastMessages.map((msg) => ({
        role: msg.role === "ASSISTANT" ? "assistant" : "user",
        content: msg.content
    }));

    return [
        systemPrompt,
        ...formattedMessages
    ];
}

export async function generateShortSummary(prompt: string) {
    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "deepseek-r1",
            prompt: `
Ringkas kalimat berikut menjadi maksimal 5 kata saja.
Jangan pakai tanda kutip.
Jangan lebih dari 5 kata.

Kalimat:
"${prompt}"
      `,
            stream: false
        })
    });

    const data = await res.json();

    return data.response.trim();
}