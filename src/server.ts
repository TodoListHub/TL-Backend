import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import routes from './routes/index'
import morgan from 'morgan'
import swaggerOutput from '../swagger-output.json'

const app = express()

app.use(cors({
    origin : "https://tl-front-eight.vercel.app",
    credentials : true,
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use("/" , routes())
app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup(swaggerOutput)) // It is placed inside the imported parentheses of the swagger-output.json file


dotenv.config()

const port = process.env.PORT || 4000;
app.listen(port , (err)=>{
    if (err) {
        console.log(err)
    }else{
        console.log(`Server is running on port ${port}`)
    }
})
