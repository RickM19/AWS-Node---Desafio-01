const express = require("express")
const router = express.Router()
const Car = require("../models/Car")
const CarItem = require("../models/CarItem")
const requiredCarFields = require("../middlewares/requiredCarsFields")


router.post("/", requiredCarFields, async (req, res) => {
    try {
        const {brand, model} = req.body
        let items = [...new Set(req.body.items)]
        const year = parseInt(req.body.year)
        const currentYear = new Date().getFullYear()

        if ((currentYear - year) > 10) {
            return res.status(400).json({error: `year should between ${currentYear - 10} and ${currentYear}`})
        }
        const existingCar = await Car.findOne({
                where: {
                    brand: brand,
                    model: model,
                    year: year
                }
            })
        if (existingCar) {
            return res.status(409).json({error: "there is already car with this data"})
        }
        
        const newCar = await Car.create({brand, model, year})
        const CarId = newCar.id

        items = items.map(item => ({
            name: item,
            CarId: CarId
        }))
        await CarItem.bulkCreate(items, {
            validate: true
        })

        res.status(201).json({id: CarId})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "internal server error"})
    }
})

router.get("/", (req, res) => {
    const {page, limit, brand, model, year} = req.query
})

router.get("/:id", async(req,res) => {
    const id = req.params.id
    const carFound = await Car.findByPk(id)
    if (carFound) {
        const {brand, model, year} = carFound
        
        let items = await carFound.getCarItems()
        items = items.map(item => item.name)
        
        return res.status(200).json({brand, model, year, items})
    }
    res.status(404).json({error: "car not found"})
})

router.patch("/:id", (req,res) => {
    const id = req.params.id
})

router.delete("/:id", (req,res) => {
    const id = req.params.id
})


module.exports = router