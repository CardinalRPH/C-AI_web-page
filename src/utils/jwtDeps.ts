import jwt from 'jsonwebtoken'
import processEnv from '../../env'

const jwtSecret = processEnv.JWT_SECRET
export const jwtSign = (currData: object | string) => {
    try {
        const signed = jwt.sign(currData, jwtSecret)
        return signed
    } catch (error) {
        throw error
    }
}

export const jwtVerify = (jwtToken: string) => {
    try {
        const verified = jwt.verify(jwtToken, jwtSecret)
        return verified
    } catch (error) {
        throw error
    }
}