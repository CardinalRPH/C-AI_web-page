import { trpc } from "@/utils/trpc"
import { useRouter } from "next/navigation"

export const useAuthLogin = () => {
    const router = useRouter()

    return trpc.auth.login.useMutation({
        onSuccess: (data) => {
            localStorage.setItem("user", JSON.stringify(data.data.user))

            router.replace("/chats")
        },
        onError: (error) => {

            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}
export const useAuthSignUp = () => {
    const router = useRouter()

    return trpc.auth.signUp.useMutation({
        onSuccess: () => {
        
            router.replace("/login")
        },
        onError: (error) => {

            const serverMessage =
                error.data || error.message || "Something went wrong"
            console.error(serverMessage ?? "Something went wrong")
        },
    })
}