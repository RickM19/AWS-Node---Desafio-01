const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Car = db.define("Car", {
    brand: {
        type: DataTypes.STRING,
        required: true,
    },
    model: {
        type: DataTypes.STRING,
        required: true
    },
    year: {
        type: DataTypes.INTEGER,
        required: true
    }
})

module.exports = Car