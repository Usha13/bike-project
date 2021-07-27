const jwt = require("jsonwebtoken")
const User = require("../model/user")

const auth = async (req,res,next)=>{
    try {
        const {authorization} = req.headers
        const token = authorization.replace("Bearer ","")
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, token})
        if(!user){
            return res.status(401).json({"error" : "Please LogIn First" })
        }
        req.user = user
        req.token = token
        next()

    } catch (err) {
        res.status(401).json({"error" : "Please LogIn First" })
    }
}

module.exports = auth