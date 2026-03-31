import { prisma } from "@/libs/prisma"
import { TRPCError } from "@trpc/server"
import { generateShortSummary } from "./ai.service"

export const messageService = {
    sendFirstMsg: async (prompt: string, userId: string) => {
        try {
            const isExistUser = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!isExistUser) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User unauthorize"
                })
            }

            const generatedSum = await generateShortSummary(prompt)

            const chatSession = await prisma.chatSession.create({
                data: {
                    summary: generatedSum,
                    userId,
                }
            })

            return {
                data: {
                    summary: chatSession.summary,
                    sessionURI: chatSession.sessionURI,
                    prompt
                }
            }
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }
    }
}