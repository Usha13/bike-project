require("../db/mongoose")
const express = require("express")
const Bike = require("../model/bike")
const bikeRoutes = express.Router()
const auth = require("../middleware/auth")
const BikeType = require("../model/bike_type")

bikeRoutes.post('/', auth, async (req,res)=>{
    
    try {
        const biketype = await BikeType.findOne({type_name : req.body.bike_type.toLowerCase()})
        if(!biketype){
            return res.status(404).send({"error": "Bike type does not exist"})
        }
        const bike =  new Bike({...req.body, bike_type: biketype._id, createdBy: req.user._id})
        const bk = await bike.save()
        res.status(201).send(bk)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})


bikeRoutes.delete('/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try {
        const bike = await Bike.findOne({_id})
        if(!bike){
            return res.status(404).send({"error": "Bike not found"})
        }
        const ownbike = await Bike.findOne({_id, createdBy: req.user._id})
        if(!ownbike){
            return res.status(404).send({"error": "You can't delete this bike"})
        }
        const delbike = await Bike.findOneAndDelete({_id})
        res.status(200).send({"message": "Bike deleted successfully"})
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.patch('/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try {
        const bike = await Bike.findOne({_id})
        if(!bike){
            return res.status(404).send({"error": "Bike not found"})
        }
        const ownbike = await Bike.findOne({_id, createdBy: req.user._id})
        if(!ownbike){
            return res.status(404).send({"error": "You can't update this bike"})
        }
        if(req.body.bike_type)
        {
            const biketype = await BikeType.findOne({type_name : req.body.bike_type.toLowerCase()})
            if(!biketype){
                return res.status(404).send({"error": "Bike type does not exist"})
            }
            var update = {...req.body , bike_type: biketype._id }
            
        }
        else{
            var update = {...req.body}
        }
        const upbike =  await Bike.findOneAndUpdate({_id}, update, {new : true})
        res.status(200).send(upbike)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.get('/recent', async (req,res)=>{
    
    try {
        if(req.query.limit)
        {
            const bikesl = await Bike.find({},null, {sort: {updatedAt: -1}, limit: parseInt(req.query.limit)}).populate("bike_type","_id type_name")
            return res.status(200).send(bikesl)
        }
        const bikes = await Bike.find({},null, {sort: {updatedAt: -1}}).populate("bike_type","_id type_name")
        res.status(200).send(bikes)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.get('/mostliked', async (req,res)=>{    
    try {
        if(req.query.limit)
        {
            const bikesl = await Bike.find({},null, {sort: {totalLikes: -1}, limit: parseInt(req.query.limit)})
            return res.status(200).send(bikesl)
        }
        const bikes = await Bike.find({},null, {sort: {totalLikes: -1}} )         
        res.status(200).send(bikes)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.get('/mybikes',auth, async (req,res)=>{    
    try {
        if(req.query.limit)
        {
            const mybikes = await Bike.find({createdBy: req.user._id},null, { limit: parseInt(req.query.limit)})
            return res.status(200).send(mybikes)
        }
        const bikes = await Bike.find({createdBy: req.user._id})         
        res.status(200).send(bikes)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.get('/:id', async (req,res)=>{  
    const _id = req.params.id 
    try {
        const bike = await Bike.findById(_id)
        if(!bike){
            return res.status(404).send({"error": "Bike not found"})
        }
        res.status(200).send(bike)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.get('/', async (req,res)=>{   
    try {
        if(req.query.bike_type){
            const bt = req.query.bike_type.toLowerCase()
            const bikeType= await BikeType.findOne({type_name : bt})
            if(!bikeType){
                return res.status(400).send({"error" : "Bike Type does not exist. Please try another one"})
            }
 
            await bikeType.populate({path: "bikes"}).execPopulate()
            console.log(bikeType)
            console.log(bikeType.bikes)
            return res.status(200).send(bikeType.bikes)
        }

        const bt = await Bike.find().populate("comments.postedBy","_id username")
        res.status(200).send(bt)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})



bikeRoutes.put('/like', auth, async (req,res)=>{    
    try {
        const bk = await Bike.findOne({_id:req.body.bikeId, likes: [req.user._id]})
        if(bk){
                return res.status(400).send({"error": "Already Liked"})
        }
           
        const bike = await Bike.findByIdAndUpdate(req.body.bikeId, {
            $push:{
               likes: req.user._id
            },
            $inc: { "totalLikes" : 1 },
            $pull:{
                dislikes: req.user._id
             }
        },{new: true})
        if(!bike){
            return res.status(404).send({"error": "Bike Not Exist"})
        }
        res.status(200).send(bike)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

bikeRoutes.put('/dislike', auth, async (req,res)=>{    
    try {
        const bk = await Bike.findOne({_id:req.body.bikeId, dislikes: [req.user._id]})
        if(bk){
                return res.status(400).send({"error" : "Already Disliked"})
        }
        const inlike = await Bike.findOne({_id:req.body.bikeId, likes: [req.user._id]})
        if(inlike){
            await Bike.findByIdAndUpdate(req.body.bikeId, {$inc: { "totalLikes" : -1 }})
        }           
        const bike = await Bike.findByIdAndUpdate(req.body.bikeId, {
            $push:{
                dislikes: req.user._id
            },
            $pull:{
                likes: req.user._id
             }
        },{new: true})
        if(!bike){
            return res.status(404).send({"error": "Bike Not Exist"})
        }
        res.status(200).send(bike)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})


bikeRoutes.put('/comment', auth, async (req,res)=>{    
    try {
        const comment = {
            commentText: req.body.comment,
            postedBy: req.user._id
        }
        if(!req.body.comment || req.body.comment==''){
            return res.status(404).send({"error": "Comment text required"})
        }
    
        const bike = await Bike.findByIdAndUpdate(req.body.bikeId, {
            $push:{
               comments: comment
            },
        },{new: true}).populate("comments.postedBy","_id username")

        if(!bike){
            return res.status(404).send({"error": "Bike Not Exist"})
        }
        res.status(200).send(bike)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

module.exports = bikeRoutes