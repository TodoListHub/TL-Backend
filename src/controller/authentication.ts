import express from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


const prisma = new PrismaClient()
dotenv.config()

const jwtSecret = process.env.JWT_SECRET || 'asfhdb36t3svvdcaqs1'

export function generateJwtToken(userId: string):String{
    const token = jwt.sign({ userId }, jwtSecret , { expiresIn: '7d'})
    return token
}

export async function validateJwtToken(token: string):Promise<any> {
    try {
        const decoded = jwt.verify(token, jwtSecret)
        return decoded
    } catch (error) {
        throw new Error('Invalid token')
    }
}

export async function signUp(req: express.Request, res: express.Response):Promise<any>{
    try{

        const { username, email, password } = req.body
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })

        const token = generateJwtToken(user.id.toString())
        res.cookie("token" , token , { httpOnly: true , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        res.status(201).json({ message: "User create successfully" })

    }catch(error){
        res.status(500).json({ message: 'Internal server error'})
    }
}

export async function signIn(req: express.Request, res: express.Response):Promise<any>{
    try{
        const { email , password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
    if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = generateJwtToken(user.id.toString())
        res.cookie("token" , token , { httpOnly: true , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        res.status(200).json({ message: 'Sign in successful'})
    }catch(error){
        res.status(500).json({ message: 'Internal server error'})
    }
}

export async function status(req:express.Request , res:express.Response):Promise<any> {
    try{
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

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ user })
    }catch(error){
        res.status(500).json({ message: 'Internal server error'})
    }
    
}

export async function resetPassword (req:express.Request , res: express.Response) : Promise<any> {
    try{
        const { token , newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Invalid request'})
        }

        const decoded = await validateJwtToken(token)

        await prisma.user.update({
            where: {
                id: decoded.userId
            },
            data: {
                password: newPassword
            }
        })

        res.status(200).json({ message: 'Password reset successful' })
    } catch(error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}