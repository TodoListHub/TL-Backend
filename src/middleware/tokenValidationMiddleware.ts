import express from 'express'
import { validateJwtToken } from '../controller/authentication'


declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export async function tokenValidationMiddleware(req: express.Request, res: express.Response, next:express.NextFunction):Promise<any>{
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'token is required' })
        }


        const decoded = await validateJwtToken(token)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

export async function authenticationMiddelware(req : express.Request , res: express.Response , next: express.NextFunction):Promise<any> {
    try{
        const authentication = req.headers['authorization']
        console.log(authentication)
        
        if (!authentication) {
            return res.status(401).json({ message: 'token is required' })
        }

        const token = authentication.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'token is missing or invalid' })
        }

        const decoded = await validateJwtToken(token)

        if (!decoded) {
            return res.status(401).json({ message: 'token is invalid' })
        }

        req.userId = decoded.userId
        next()
    }catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }

}