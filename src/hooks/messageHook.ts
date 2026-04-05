import { trpc } from "@/utils/trpc"
import { useRouter } from "next/navigation"

export const useSendFirstMsg = () => {
    const router = useRouter()

    return trpc.message.firstMsg.useMutation({
        onSuccess: (data) => {
            router.push(`/chats/${data.data.sessionURI}`)
        },
        onError: (error) => {
            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        }
    })
}

export const useGetChatHistory = () => trpc.message.getChatHistory.useQuery()

export const useGetMsgHistory = (chatId?: string) => trpc.message.getMsgHistory.useQuery({
    chatId: chatId!
}, {
    enabled: false
})

