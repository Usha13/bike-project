require("../db/mongoose")
const express = require("express")
const BikeType = require("../model/bike_type")
const bikeTypeRoutes = express.Router()
const auth = require("../middleware/auth")

bikeTypeRoutes.post('/',auth,async (req,res)=>{
    
    try {
        const {type_name} = req.body
        if(!type_name){
            return res.status(400).json({"error": "Enter bike type "})
        }
        const tn = type_name.toLowerCase()
        const bike_type = new BikeType({type_name: tn})
        const bt = await bike_type.save()
        res.status(201).send(bt)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeTypeRoutes.get('/',auth,async (req,res)=>{
    
    try {
        const bt = await BikeType.find()
        res.status(200).send(bt)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

module.exports = bikeTypeRoutes