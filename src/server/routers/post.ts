import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { postService } from '../services/post.service'

export const postRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.string(),
            })
        )
        .mutation(({ input }) => {
            return postService.create(input)
        }),

    getAll: publicProcedure.query(() => {
        return postService.getAll()
    }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => {
            return postService.getById(input.id)
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string().optional(),
                content: z.string().optional(),
            })
        )
        .mutation(({ input }) => {
            return postService.update(input.id, input)
        }),

    delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(({ input }) => {
            return postService.delete(input.id)
        }),
})