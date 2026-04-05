import { prisma } from "@/libs/prisma";
import { buildOllamaMessage } from "@/server/services/ai.service";


export async function POST(req: Request) {
    const { prompt, chatId } = await req.json();

    const session = await prisma.chatSession.findFirst({
        where: { sessionURI: chatId }
    });

    if (!session) {
        return new Response(
            JSON.stringify({ message: "Invalid chat sessionX" }),
            { status: 400 }
        );
    }

    const sessionId = session.id

    await prisma.message.create({
        data: {
            chatSessionId: sessionId,
            role: "USER",
            content: prompt,
        }
    });

    const messages = await buildOllamaMessage(sessionId);
    if (!messages) {
        return new Response(
            JSON.stringify({ message: "Invalid chat sessionY" }),
            { status: 400 }
        );
    }

    const ollamaRes = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "deepseek-r1",
            messages,
            stream: true
        })
    });

    const encoder = new TextEncoder();

    let fullResponse = "";

    const stream = new ReadableStream({
        async start(controller) {
            const reader = ollamaRes.body!.getReader();
            const decoder = new TextDecoder();

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const json = JSON.parse(line);

                        const text = json.message?.content;

                        if (text) {
                            fullResponse += text;

                            controller.enqueue(
                                encoder.encode(text)
                            );
                        }

                        if (json.done) {
                            await prisma.message.create({
                                data: {
                                    chatSessionId: sessionId,
                                    role: "ASSISTANT",
                                    content: fullResponse
                                }
                            });

                            controller.close();
                            return;
                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain"
        }
    });
}