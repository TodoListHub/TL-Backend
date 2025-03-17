import express from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


const prisma = new PrismaClient()
dotenv.config()

const jwtSecret = process.env.JWT_SECRET || 'asfhdb36t3svvdcaqs1'

export function generateJwtToken(userId: string):String{
    const token = jwt.sign({ userId }, jwtSecret , { expiresIn: '1h'})
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
        res.cookie("token" , token , { httpOnly: true })
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
        res.cookie("token" , token , { httpOnly: true })
        res.status(200).json({ message: 'Sign in successful'})
    }catch(error){
        res.status(500).json({ message: 'Internal server error'})
    }
}