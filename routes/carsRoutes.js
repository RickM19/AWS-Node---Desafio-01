const express = require("express")
const router = express.Router()
const CarController = require("../controllers/CarControllers")
const requiredCarFields = require("../middlewares/requiredCarsFields")



router.post("/", requiredCarFields, CarController.createCar)

router.get("/", CarController.getCar)

router.get("/:id", CarController.getCarWithId)

router.patch("/:id", CarController.updateCar)

router.delete("/:id", CarController.deleteCar)


module.exports = router