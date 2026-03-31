import { firstMsgSchema } from "../schemas/message.schema";
import { messageService } from "../services/message.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
    firstMsg: protectedProcedure.input(firstMsgSchema).mutation(async ({ input, ctx }) => {
        return await messageService.sendFirstMsg(input.prompt, ctx.user.userId)
    })
})