import { firstMsgSchema, getMsgHistorySchema } from "../schemas/message.schema";
import { chatService } from "../services/chat.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
    firstMsg: protectedProcedure.input(firstMsgSchema).mutation(async ({ input, ctx }) => {
        return await chatService.sendFirstMsg(input.prompt, ctx.user)
    }),
    getChatHistory: protectedProcedure.query(async ({ ctx }) => {
        return await chatService.getChatHistory(ctx.user)
    }),
    getMsgHistory: protectedProcedure.input(getMsgHistorySchema).query(async ({ input }) => {
        return await chatService.getMsgHistory(input.chatId)
    })
})