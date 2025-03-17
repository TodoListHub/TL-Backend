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
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const token = authHeader.split(' ')[1]
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