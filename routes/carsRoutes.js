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

        return res.status(201).json({id: CarId})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "internal server error"})
    }
})

router.get("/", async (req, res) => {
    try {
        const {page = 1, brand, model, year} = req.query
        let limit = Number(req.query.limit)
        if (!limit || (limit < 1)) {
            limit = 5
        }
        if (limit > 10) {
            limit = 10
        }
        let lastpage = 1
        const whereFilter = {}
        if (brand) {
            whereFilter.brand = brand
        }
        if (model) {
            whereFilter.model = model
        }
        if (year) {
            whereFilter.year = year
        }

        const countCars = await Car.count({
            where: whereFilter
        })

        lastpage = Math.ceil(countCars / limit)

        if (countCars !== 0 && lastpage >= page) {
            const data = await Car.findAll({
                where: whereFilter,
                attributes: ["id", "brand", "model", "year"],
                offset: Number((page * limit) - limit),
                limit: limit
            })
            console.log(data)
            return res.status(200).json({pages: lastpage, count: countCars, data: data})
        }
        return res.status(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "internal server error"})
    }
    
    
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