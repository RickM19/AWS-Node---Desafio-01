const Car = require("../models/Car")
const CarItem = require("../models/CarItem")


module.exports = class CarController {
    
    static async createCar (req, res) {
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
                        brand: brand.toLowerCase(),
                        model: model.toLowerCase(),
                        year: year
                    }
                })
            if (existingCar) {
                return res.status(409).json({error: "there is already car with this data"})
            }
            
            const newCar = await Car.create({
                        brand: brand.toLowerCase(),
                        model: model.toLowerCase(),
                        year
                    })
            const CarId = newCar.id
    
            items = items.map(item => ({
                name: item.toLowerCase(),
                CarId: CarId
            }))
            await CarItem.bulkCreate(items, {
                validate: true
            })
    
            res.status(201).json({id: CarId})
        } catch (err) {
            res.status(500).json({error: "internal server error"})
        }
    }

    static async getCar(req, res) {
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
                whereFilter.brand = brand.toLowerCase()
            }
            if (model) {
                whereFilter.model = model.toLowerCase()
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
                    offset: Number((+page * limit) - limit),
                    limit: limit
                })
                return res.status(200).json({pages: lastpage, count: countCars, data: data})
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({error: "internal server error"})
        }
    }

    static async getCarWithId(req,res) {
        try {
            const id = req.params.id
            const carFound = await Car.findByPk(id)
            if (carFound) {
                const {brand, model, year} = carFound
                
                let items = await carFound.getCarItems()
                items = items.map(item => item.name)
                
                return res.status(200).json({brand, model, year, items})
            }
            res.status(404).json({error: "car not found"})
    
        } catch(err) {
            res.status(500).json({error: "internal server error"})
        }
        
    }

    static async updateCar(req,res) {
        try {
            const id = req.params.id
            const car = await Car.findOne({where: { id }, attributes: ["brand", "model", "year"], raw: true})
            if (!car) {
                return res.status(404).json({error: "car not found"})
            }
            const {brand, model} = req.body
            const year = parseInt(req.body.year)
            let items = req.body.items
            const newCar = {...car}
    
            if (brand) {
                newCar.brand = brand.toLowerCase()
            }
            if (model) {
                newCar.model = model.toLowerCase()
            }
            if (year) {
                const currentYear = new Date().getFullYear()
                if ((currentYear - year) > 10) {
                    return res.status(400).json({error: `year should between ${currentYear - 10} and ${currentYear}`})
                }
                newCar.year = year
            }
            const existingCar = await Car.findOne({where: newCar})
            if (existingCar) {
                return res.status(409).json({error: "there is already car with this data"})
            }
            if (items) {
                items = [...new Set(req.body.items)]
                await CarItem.destroy({where: { CarId:id }})
                items = items.map(item => ({
                    name: item.toLowerCase(),
                    CarId: id
                }))
                await CarItem.bulkCreate(items, {
                    validate: true
                })
            }
            await Car.update(newCar, { where: {id}})
            
            res.status(204).json()
        } catch (err) {
            res.status(500).json({error: "internal server error"})
        }
        
    }

    static async deleteCar(req,res) {
        try {
            const id = req.params.id
            const car = await Car.findOne({where: { id }})
            if (!car) {
                return res.status(404).json({error: "car not found"})
            }
            await CarItem.destroy({where: { CarId:id }})
            await Car.destroy({where: { id }})
            
            res.status(204).json()
    
        } catch(err) {
            res.status(500).json({error: "internal server error"})
        }
    }
}