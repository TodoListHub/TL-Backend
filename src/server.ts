import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import routes from './routes/index'

const app = express()

app.use(cors({
    credentials : true,
}))
app.use(bodyParser.json())
// app.use("/" , routes)
app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup()) // It is placed inside the imported parentheses of the swagger-output.json file


dotenv.config()

const port = process.env.PORT || 4000;
app.listen(port , (err)=>{
    if (err) {
        console.log(err)
    }else{
        console.log("Server is running")
    }
})
