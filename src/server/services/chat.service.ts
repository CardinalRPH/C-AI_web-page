import { prisma } from "@/libs/prisma"
import { TRPCError } from "@trpc/server"
import { generateShortSummary } from "./ai.service"
import { User } from "../../../prisma/src/generated/prisma/browser"
import { messageType } from "@/app/chats/dto"

export const chatService = {
    sendFirstMsg: async (prompt: string, user: Omit<User, "password">) => {
        try {

            const generatedSum = await generateShortSummary(prompt)

            const chatSession = await prisma.chatSession.create({
                data: {
                    summary: generatedSum,
                    userId: user.id,
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
    },
    getChatHistory: async (user: Omit<User, "password">) => {
        try {
            const recentChat = await prisma.chatSession.findMany({
                where: {
                    userId: user.id
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            const fixedValue = recentChat.map((value, index) => ({
                id: `rcnt-msg-${index}`,
                title: value.summary,
                linkTo: `/chats/${value.sessionURI}`
            }))

            return {
                data: fixedValue
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
    },
    getMsgHistory: async (chatId: string) => {
        try {
            const sesId = await prisma.chatSession.findFirst({
                where: {
                    sessionURI: chatId
                }
            })
            const recentMsg = await prisma.message.findMany({
                where: {
                    chatSessionId: sesId?.id
                },
                orderBy: {
                    createdAt: "asc"
                }
            })

            const fixedValue: messageType[] = recentMsg.map(value => ({
                content: value.content,
                id: value.id,
                isNew: false,
                role: value.role
            }))

            return {
                data: fixedValue
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