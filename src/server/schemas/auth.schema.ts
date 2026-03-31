import z from "zod";

export const authLoginSchema = z.object({
    email: z.email(),
    password: z.string()
        .min(8)
        .max(20),
})

export type authLoginSchemaType = z.infer<typeof authLoginSchema>

export const authCreateAccountSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .max(20),
    confirmPassword: z.string().min(8).max(20),
    name: z.string().min(4).max(50),
    email: z.email()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
});

export type authCreateAccountSchemaType = z.infer<typeof authCreateAccountSchema>