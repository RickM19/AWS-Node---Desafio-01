const express = require("express")
const conn = require("./db/conn")
const port = 3000


// importing models
const Car = require("./models/Car")
const CarItem = require("./models/CarItem")

const app = express()

conn
    .sync()
    .then(() => {
        app.listen(port)
    })
    .catch((err) => {
        console.log(err)
    })