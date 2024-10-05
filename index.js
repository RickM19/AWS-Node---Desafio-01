const express = require("express")
const conn = require("./db/conn")
const port = 3000

// importing midleware
const handleJsonError = require("./middlewares/handleJsonError")


// importing models
const Car = require("./models/Car")
const CarItem = require("./models/CarItem")

// importing routes
const carRoutes = require("./routes/carsRoutes")

const app = express()

app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json())

app.use(handleJsonError)

app.use("/api/v1/cars", carRoutes)

conn
    .sync()
    .then(() => {
        app.listen(port)
    })
    .catch((err) => {
        console.log(err)
    })