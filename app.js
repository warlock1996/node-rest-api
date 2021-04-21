const path = require("path")
const dotenv = require("dotenv")
dotenv.config({
    path: path.resolve(process.cwd(), ".env")
})
const express = require("express")

const routes = require("./routes/api")


const app = express()

app.use(routes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`)
})