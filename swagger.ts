import swaggerAutogen from 'swagger-autogen'


const doc = {
    info : {
        title : "My Api",
        description : "Api Description"
    },
    host : "localhost:4002",
    basePath : "./src/routes/index.ts",
}

const outputFile = "swagger-output.json"
const endPointsFiles = ["./src/routes/*.ts"]

swaggerAutogen()(outputFile , endPointsFiles , doc)