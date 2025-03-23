import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client"
const {body , validationResult} = require('express-validator')

const prisma = new PrismaClient()
dotenv.config()

export const Title = [
    body("title").optional().notEmpty().withMessage("Title is required")
    .isLength({max:30}).withMessage("The title must be a maximum of 30 characters!"),

    body("description").optional().notEmpty().withMessage("Description is required")
    .isLength({min:5,max:100}).withMessage("The description must be a maximum of 100 characters!"),
]

export async function createTask(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { title, description } = req.body

    if (!title || !description) {
        return res.status(400).json({ message: 'Invalid request' })
    }

    const task = await prisma.task.create({
        data: {
            title,
            userId: Number(req.userId),
            status : "NotStarted"
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


    if (!req.body){

        if (task.status === "NotStarted"){
            const updateTable = await prisma.task.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    status : "TODO"
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
                    status : "NotStarted"
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