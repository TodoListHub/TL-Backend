import express from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { deleteUser, logIn, resetPassword, signIn, status } from '../controller/authentication'
import { tokenValidationMiddleware} from '../middleware/tokenValidationMiddleware'
import { sendResetPasswordEmail } from '../helper/sendResetPasswordEmail'
import {SignIn , LogIn , ResetPass } from '../controller/authentication'
const prisma = new PrismaClient()

dotenv.config()

export default (router : express.Router) =>{
    router.get("/status" , tokenValidationMiddleware , status)
    router.post("/signIn" , SignIn,  signIn)
    router.post("/logIn", LogIn , logIn)
    router.post("/reset-password" , async(req:express.Request , res:express.Response):Promise<any> =>{
        try{

            const { email } = req.body

            if (!email) {
                return res.status(400).json({ message: "Email is required"})
            }

            const user = await prisma.user.findFirst({
                where: {
                    email: email
                },
            })

            if (!user || !user.email) {
                return res.status(404).json({ message: "User not found"})
            }

            const jwtSecret = process.env.JWT_SECRET || 'asfhdb36t3svvdcaqs1'

            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '15m' })

            res.cookie("token" , token , { httpOnly: true ,secure:true , sameSite: "none" , expires: new Date(Date.now() + 15 * 60 * 1000) })
            console.log(token)
            await sendResetPasswordEmail(user.email)

            res.status(200).json({ message: "Reset password email sent"})
        }catch(error){
            console.log(error)
            res.status(500).json({ message: "Internal server error"})
            }
    })
    router.put("/reset-password" , tokenValidationMiddleware , ResetPass , resetPassword)
 
    router.get("/delete" , deleteUser)
    
}