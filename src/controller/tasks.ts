import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client"
const {body , validationResult} = require('express-validator')

const prisma = new PrismaClient()
dotenv.config()

export const Title = [
    body("title").optional().notEmpty().withMessage("Title is required")
    .isLength({min:2 ,max:150}).withMessage("The title must be a maximum of 30 characters!"),
]

export async function createTask(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { title} = req.body

    if (!title) {
        return res.status(400).json({ message: 'Invalid request' })
    }

    const task = await prisma.task.create({
        data: {
            title,
            userId: Number(req.userId),
        }
    })

    if (!task) {
        return res.status(400).json({ message: 'Failed to create table' })
    }

    res.status(201).json({ message: 'table created successfully', task })
}

export async function getTasks(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const tables = await prisma.task.findMany({
        where: {
            userId: Number(req.userId)
        }
    })

    if (!tables) {
        return res.status(400).json({ message: 'Failed to get tasks' })
    }
    
    return res.status(200).json(tables)
}

export async function updateTask(req:express.Request , res:express.Response):Promise<any>{

    const error = validationResult(req)

    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const taskId = Number(req.params.id)

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    })

    if (!task) {
        return res.status(404).json({ message: 'Table not found' })
    }

    if (!req.body.title){

        if (task.status === false){
            const updateTable = await prisma.task.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    status : true
                }
            })
        
            if (!updateTable) {
                return res.status(400).json({ message: 'Failed to update table' })
            }

            return res.status(200).json({ message: 'Table updated successfully', updateTable })
        }else{
            const updateTable = await prisma.task.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    status : false
                }
            })

            if (!updateTable) {
                return res.status(400).json({ message: 'Failed to update table' })
            }

            return res.status(200).json({ message: 'Table updated successfully', updateTable })
        }
    }else if (req.body.title){
        const updateTable = await prisma.task.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: req.body.title
            }
        })

        if (!updateTable) {
            return res.status(400).json({ message: 'Failed to update table' })
        }

        return res.status(200).json({ message: 'Table updated successfully', updateTable })
    }
}

export async function deleteTask(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const deleteTable = await prisma.task.delete({
        where: {
            id: Number(req.params.id)
        }
    })

    if (!deleteTable) {
        return res.status(400).json({ message: 'Failed to delete table' })
    }

    return res.status(200).json({ message: 'Table deleted successfully' })
}