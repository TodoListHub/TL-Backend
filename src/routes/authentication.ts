import express from 'express'
import { PrismaClient } from '@prisma/client'
import { resetPassword, signIn, signUp, status } from '../controller/authentication'
import { tokenValidationMiddleware } from '../middleware/tokenValidationMiddleware'
import { sendResetPasswordEmail } from '../helper/sendResetPasswordEmail'
import { SignUp , SignIn , ResetPass } from '../controller/authentication'

const prisma = new PrismaClient()
export default (router : express.Router) =>{
    router.get("/status" , tokenValidationMiddleware , status)
    router.post("/signUp" , SignUp,  signUp)
    router.post("/signIn" , tokenValidationMiddleware , SignIn , signIn)
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
            console.log(error)
            res.status(500).json({ message: "Internal server error"})
            }
    })

    router.post("/reset-password" , ResetPass , resetPassword)
        
    
}