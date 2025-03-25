import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
const {body , validationResult} = require('express-validator')
import { sendResetPasswordEmail } from '../helper/sendResetPasswordEmail'

const prisma = new PrismaClient()
dotenv.config()

const jwtSecret = process.env.JWT_SECRET || 'asfhdb36t3svvdcaqs1'

export const SignIn = [
    body("username").notEmpty().withMessage("Username is required")
    .isLength({min:5}).withMessage("The username must be at least 5 characters!")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("The username can only include letters,numbers,and underlines!"),

    body("email").isEmail().withMessage("Email format is not valid!").normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required")
    .isLength({min:8}).withMessage("The password must be at least 8 characters!")
    .matches(/^[a-zA-z0-9]+$/).withMessage("The password can only include letters,numbers")
]

export const LogIn = [
    body("username").optional().notEmpty().withMessage("Username is required")
    .isLength({min:5}).withMessage("The username must be at least 5 characters!")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("The username can only include letters,numbers,and underlines!"),

    body("email").optional().isEmail().withMessage("Email format is not valid!").normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required")
    .isLength({min:8}).withMessage("The password must be at least 8 characters!")
    .matches(/^[a-zA-z0-9]+$/).withMessage("The password can only include letters,numbers")
]

export const SendEmail = [
    body("email").isEmail().withMessage("Email format is not valid!").normalizeEmail()
]

export const ResetPass = [
    body("newPassword").notEmpty().withMessage("Password is required")
    .isLength({min:8}).withMessage("The password must be at least 8 characters!")
    .matches(/^[a-zA-z0-9]+$/).withMessage("The password can only include letters,numbers")
]
export function generateJwtToken(userId: string):String{
    const token = jwt.sign({ userId }, jwtSecret , { expiresIn: '7d'})
    return token
}

export async function validateJwtToken(token: string):Promise<any> {
    try {
        const decoded = jwt.verify(token, jwtSecret)
        return decoded
    } catch (error) {
        return error
    }
}

export async function signIn(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { username, email, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required"})
    }

    const foundUserByEmail = await prisma.user.findFirst({
        where: { 
            email : email
        } , 
        select: {
            email: true
        }
    })

    const foundUserByUsername = await prisma.user.findFirst({
        where: {
            username: username
        },
        select: {
            username: true
        }
    })

    if (foundUserByEmail) {
        return res.status(400).json({ message: "User already exists"})
    }

    if (foundUserByUsername) {
        return res.status(400).json({ message: "This name was created by another user"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })

        const token = generateJwtToken(user.id.toString())
        res.cookie("token" , token , { httpOnly: true ,secure:true , sameSite: "none" , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        res.status(201).json({ message: "User create successfully"})
}

export async function logIn(req: express.Request, res: express.Response):Promise<any>{
    
    console.log(req.body)

    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { username = "" ,  email = "" , password } = req.body

    if (!email && !username) {
        return res.status(400).json({ message: "All fields are required"})
    }   



    if (email && !username){
        console.log(email)
        const user = await prisma.user.findFirst({
            where: {
                email,
            }
        })
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: '*Invalid credentials' })
        }

        const inMatch = await bcrypt.compare(password, user.password)

        if (!inMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = generateJwtToken(user.id.toString())
        res.cookie("token" , token , { httpOnly: true ,secure:true , sameSite: "none" , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        res.status(200).json({ message: 'Login in successful'})
    }else if (username && !email){
        console.log(username)
        const user = await prisma.user.findFirst({
            where: {
                username ,
            }
        })
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: '+Invalid credentials' })
        }

        const inMatch = await bcrypt.compare(password, user.password)

        if (!inMatch) {
            return res.status(401).json({ message: '-Invalid credentials' })
        }
        const token = generateJwtToken(user.id.toString())
        res.cookie("token" , token , { httpOnly: true ,secure:true , sameSite: "none" , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        res.status(200).json({ message: 'Login in successful'})
    }
}

export async function status(req:express.Request , res:express.Response):Promise<any> {

    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const userId = req.userId
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        },
        select: {
            username: true,
            email: true
        }
    })

    const totalCount = await prisma.task.count({
        where:{
            userId : Number(userId)
        }
    })
    const trueCount = await prisma.task.count({
        where:{
            userId : Number(userId),
            status : true
        }
    })

    const falseCount = await prisma.task.count({
        where : {
            userId : Number(userId),
            status: false
        }
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user , totalCount , trueCount , falseCount })
    
}

export async function sendEmail(req:express.Request , res:express.Response):Promise<any>{

    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

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
}

export async function resetPassword (req:express.Request , res: express.Response) : Promise<any> {
    
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { newPassword } = req.body

    if (!newPassword) {
        return res.status(400).json({ message: 'Invalid request'})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: {
            id: Number(req.userId)
        },
        data: {
            password: hashedPassword
        }
    })

    if (!req.userId){
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = generateJwtToken(req.userId)
    res.cookie("token" , token , { httpOnly: true ,secure:true , sameSite: "none" , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })

    res.status(200).json({ message: 'Password reset successful' })
}

export async function deleteUser(req:express.Request , res:express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    await prisma.task.deleteMany({})
    await prisma.user.deleteMany({})

    res.status(200).json({ message: 'All users deleted successfully' })
}