const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    email: {
        type: String,
        required : true,
        trim : true,
        unique:true,
        lowercase: true,
        validate : (value)=>{
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password : {
        type: String,
        minlength: 5,
        required : true,
        trim: true
    },
    
    token: {type: String}
    
}, { 
    timestamps : true
})

userSchema.methods.toJSON= function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET)
    user.token  = token
    await user.save()

    return token
}

userSchema.methods.deleteToken= function(token,cb){
    var user=this;
    
    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

const User = mongoose.model('User', userSchema)

module.exports = User