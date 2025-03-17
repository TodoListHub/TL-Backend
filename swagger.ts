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
const endPointsFiles = ["./src/server.ts"]

swaggerAutogen()(outputFile , endPointsFiles , doc)