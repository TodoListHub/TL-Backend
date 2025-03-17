import express from 'express'
import { signIn, signUp } from '../controller/authentication'
import { tokenValidationMiddleware } from '../middleware/tokenValidationMiddleware'


export default (router : express.Router) =>{
    router.post("/signUp" , signUp)
    router.post("/signIn" , tokenValidationMiddleware , signIn)
}