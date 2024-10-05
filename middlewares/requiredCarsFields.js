const validateCarFields = (req,res,next) => {
    
    const {brand, model, year, items } = req.body
    if (!brand) {
        return res.status(400).json({error: "brand is required"})
    }
    if (!model) {
        return res.status(400).json({error: "model is required"})
    }
    if (!year) {
        return res.status(400).json({error: "year is required"})
    }
    if (!items) {
        return res.status(400).json({error: "items is required"})
    }

    next()

}

module.exports = validateCarFields