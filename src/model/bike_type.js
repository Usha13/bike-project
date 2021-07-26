const mongoose = require("mongoose")

const biketypeSchema = new mongoose.Schema({
    type_name : {
        type : String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    }
}, {
    timestamps : true
})

biketypeSchema.virtual('bikes', {
    ref: 'Bike',
    localField : '_id',
    foreignField: 'bike_type'
})

const BikeType = mongoose.model('Bike_type', biketypeSchema)

module.exports = BikeType