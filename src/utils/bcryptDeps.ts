import bcrypt from "bcrypt"
import processEnv from "../../env"

export const bcryptCompare = async (currString: string, hashedString: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(currString, hashedString)

    } catch (error) {
        throw error
    }
}

const saltRound = processEnv.SALT_ROUND
export const bcryptHash = async (currString: string): Promise<string> => {
    try {
        return await bcrypt.hash(currString, saltRound)
    } catch (error) {
        throw error
    }
}