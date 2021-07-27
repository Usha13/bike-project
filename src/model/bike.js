const mongoose = require("mongoose")

const bikeSchema = new mongoose.Schema({
    title : {
        type : String,
        required: true,
        trim: true,
    },
    bike_type: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref : 'Bike_type' 
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'User' ,
    },
    likes: {
        type: mongoose.Types.ObjectId,
        ref : 'User' ,
    },
    totalLikes: {
        type: Number,
        default: 0,
        validate : (value)=>{
            if(value < 0){
                throw new Error("negative value not accepted")
            }
        }
    },
    dislikes: {
        type: mongoose.Types.ObjectId,
        ref : 'User' 
    },
    comments : {
        commentText : {type : String},
        postedBy : {type: mongoose.Types.ObjectId, ref: "User"}
    },
    price : {
        type: Number,
        required: true
    },
    engine : {
        type:String
    },
    mileage  : {
        type:String
    },
    kerb_weight : {
        type:String
    },
    max_power : {
        type:String
    },
    fuel_capacity : {
        type:String
    }
}, {
    timestamps : true
})


const Bike = mongoose.model('Bike', bikeSchema)

module.exports = Bike