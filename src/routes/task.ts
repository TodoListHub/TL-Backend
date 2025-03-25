import express from 'express'
import { createTask , getTasks , updateTask , deleteTask , Title, updateStatus } from '../controller/tasks'
import { tokenValidationMiddleware } from '../middleware/tokenValidationMiddleware'

export default (router : express.Router) => {
    router.post('/create-task', tokenValidationMiddleware , Title , createTask)
    router.get('/get-tasks', tokenValidationMiddleware , getTasks)
    router.put('/update-task/:id', tokenValidationMiddleware , Title , updateTask)
    router.put("update-status/:id" , tokenValidationMiddleware , updateStatus)
    router.delete('/delete-task/:id', tokenValidationMiddleware , deleteTask)
}