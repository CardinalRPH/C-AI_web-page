import { cookies } from "next/headers"
import { jwtVerify } from "@/utils/jwtDeps"
import { jwtUserDto } from "@/dto/userDTO"

export const createContext = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    let user = null

    if (token) {
        try {
            user = jwtVerify(token) as jwtUserDto
        } catch {
            user = null
        }
    }

    return { user }
}

export type createContextType = typeof createContext