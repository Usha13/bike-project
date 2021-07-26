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
    comments : [{
        commentText : {type : String},
        postedBy : {type: mongoose.Types.ObjectId, ref: "User"}
    }],
    price : {
        type: Number,
        required: true
    },
    engine : {
        type:String,
        required: true
    },
    mileage  : {
        type:String,
        required: true
    },
    kerb_weight : {
        type:String,
        required: true
    },
    max_power : {
        type:String,
        required: true
    },
    fuel_capacity : {
        type:String,
        required: true
    }
}, {
    timestamps : true
})


const Bike = mongoose.model('Bike', bikeSchema)

module.exports = Bike