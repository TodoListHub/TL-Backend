import express from 'express'
import authentication from './authentication'
import task from './task'

const router = express.Router()
export default (): express.Router =>{
    authentication(router)
    task(router)
    return router
}