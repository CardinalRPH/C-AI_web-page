import { prisma } from "@/libs/prisma"
import { bcryptCompare, bcryptHash } from "@/utils/bcryptDeps"
import { jwtSign } from "@/utils/jwtDeps"
import { TRPCError } from "@trpc/server"
import { authCreateAccountSchemaType, authLoginSchemaType } from "../schemas/auth.schema"
import { cookies } from "next/headers"
import processEnv from "../../../env"

export const authService = {
    login: async ({ email, password }: authLoginSchemaType) => {
        try {
            const data = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                })
            }

            const isValid = await bcryptCompare(password, data.password)
            if (!isValid) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Wrong password"
                })
            }
            const token = jwtSign({ userId: data.id })

            const cookieStore = await cookies()

            cookieStore.set("token", token, {
                httpOnly: true,
                secure: processEnv.ENV === "production",
                sameSite: "strict",
                path: "/",
            })
            return {
                message: "Successfully login",
                data: {
                    user: {
                        email: data.email,
                        name: data.name
                    }
                }
            }
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Login failed"
            })
        }
    },
    createAccount: async ({ email, name, password }: authCreateAccountSchemaType) => {
        try {
            const isExist = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (isExist) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already exist"
                })
            }

            const createdData = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: await bcryptHash(password),
                }
            })
            return {
                message: "User created",
                data: {
                    email: createdData.email,
                    name: createdData.name,
                    createdAt: createdData.createdAt
                }

            }
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user"
            })
        }
    }
}