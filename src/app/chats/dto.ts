import { MessageRole } from "../../../prisma/src/generated/prisma/enums"

export type chatHistoryType = {
    id: string
    title: string
    linkTo: string
}

export type messageType = {
    id: number
    role: MessageRole
    content: string,
    isNew: boolean
}