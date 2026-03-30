import { prisma } from "@/libs/prisma";
import { buildOllamaMessage } from "@/server/services/ai.service";


export async function POST(req: Request) {
    const { prompt } = await req.json();
    const sessionId = "xxSess1"

    await prisma.message.create({
        data: {
            sessionId,
            role: "USER",
            content: prompt
        }
    });

    const messages = await buildOllamaMessage(sessionId);

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
                                    sessionId,
                                    role: "ASSISTANT",
                                    content: fullResponse
                                }
                            });

                            controller.close();
                            return;
                        }

                    } catch { }
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