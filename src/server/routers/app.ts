

import { createTRPCRouter } from '../trpc'
import { authRouter } from './auth'
import { messageRouter } from './message'
import { postRouter } from './post'

export const appRouter = createTRPCRouter({
    post: postRouter,
    auth: authRouter,
    message: messageRouter
})

export type AppRouter = typeof appRouter