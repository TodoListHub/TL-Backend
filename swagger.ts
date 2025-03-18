import swaggerAutogen from 'swagger-autogen'


const doc = {
    info : {
        title : "My Api",
        description : "Api Description"
    },
    host : "localhost:4002",
    schemes:  ["http"],
}

const outputFile = "swagger-output.json"
const endPointsFiles = ["./src/routes/index.ts"]

swaggerAutogen()(outputFile , endPointsFiles , doc)