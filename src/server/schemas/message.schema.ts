import z from "zod";

export const firstMsgSchema = z.object({
    prompt: z.string().min(5).max(200)
})

export type firstMsgSchemaType = z.infer<typeof firstMsgSchema>