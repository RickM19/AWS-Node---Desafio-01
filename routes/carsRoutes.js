const express = require("express")
const router = express.Router()
const Car = require("../models/Car")
const CarItem = require("../models/CarItem")

router.post("/", (req, res) => {
    const {brand, model, year, items} = req.body
    
})

router.get("/", (req, res) => {
    const {page, limit, brand, model, year} = req.query
})

router.get("/:id", (req,res) => {
    const id = req.params.id
})

router.patch("/:id", (req,res) => {
    const id = req.params.id
})

router.delete("/:id", (req,res) => {
    const id = req.params.id
})


module.exports = router