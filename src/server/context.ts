import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(_opt:FetchCreateContextFnOptions) {
    return {}
}

export type Context = Awaited<ReturnType<typeof createContext>>