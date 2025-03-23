import express from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { deleteUser, logIn, resetPassword, sendEmail, signIn, status } from '../controller/authentication'
import { tokenValidationMiddleware} from '../middleware/tokenValidationMiddleware'
import { sendResetPasswordEmail } from '../helper/sendResetPasswordEmail'
import {SignIn , LogIn , ResetPass, SendEmail } from '../controller/authentication'
const prisma = new PrismaClient()

dotenv.config()

export default (router : express.Router) =>{
    router.get("/status" , tokenValidationMiddleware , status)
    router.post("/signIn" , SignIn,  signIn)
    router.post("/logIn", LogIn , logIn)
    router.post("/reset-password" , SendEmail , sendEmail)
    router.put("/reset-password" , tokenValidationMiddleware , ResetPass , resetPassword)
 
    router.get("/delete" , deleteUser)
    
}