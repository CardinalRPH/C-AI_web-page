import { authCreateAccountSchema, authLoginSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
    login: publicProcedure.input(authLoginSchema).mutation(async ({ input }) => {
        return await authService.login(input)
    }),
    signUp: publicProcedure.input(authCreateAccountSchema).mutation(async ({ input }) => {
        return await authService.createAccount(input)
    })
})