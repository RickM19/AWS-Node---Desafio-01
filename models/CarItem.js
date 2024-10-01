const { DataTypes } = require("sequelize")

const db = require("../db/conn")
const Car = require("./Car")


const CarItem =  db.define("CarItem", {
    name: {
        type: DataTypes.STRING,
        required: true
    }
},
{
    tableName: "cars_items"
})

Car.hasMany(CarItem)
CarItem.belongsTo(Car)

module.exports = CarItem