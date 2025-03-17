import express from 'express'
import { signIn, signUp } from '../controller/authentication'
import { tokenValidationMiddleware } from '../middleware'


export default (router : express.Router) =>{
    router.post("/signUp" , signUp)
    router.post("/signIn" , tokenValidationMiddleware , signIn)
}