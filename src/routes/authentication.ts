import express from 'express'
import { PrismaClient } from '@prisma/client'
import { signIn, signUp, status } from '../controller/authentication'
import { tokenValidationMiddleware } from '../middleware/tokenValidationMiddleware'
import { sendResetPasswordEmail } from '../helper/sendResetPasswordEmail'

const prisma = new PrismaClient()
export default (router : express.Router) =>{
    router.get("/satus" , tokenValidationMiddleware , status)
    router.post("/signUp" , signUp)
    router.post("/signIn" , tokenValidationMiddleware , signIn)
    router.get("/reset-password" , tokenValidationMiddleware , async(req:express.Request , res:express.Response):Promise<any> =>{
        try{

            const user = await prisma.user.findUnique({
                where: {
                    id: Number(req.userId)
                },
                select: {
                    email: true
                }
            })

            if (!user || !user.email) {
                return res.status(404).json({ message: "User not found"})
            }

            await sendResetPasswordEmail(user.email , Number(req.userId))

            res.status(200).json({ message: "Reset password email sent"})
        }catch(error){
            res.status(500).json({ message: "Internal server error"})
            }
    })

    router.post("/reset-password" , )
        
    
}