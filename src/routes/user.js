const express = require("express")
const bcrypt = require("bcrypt")
const User = require('../model/user')
const userroutes = express.Router()
const auth = require("../middleware/auth")

userroutes.post('/register', async (req,res)=>{
    const {username,email,password} = req.body
    try {
        if(!username || !email || !password){
            return res.status(400).send({"error": "All fields are required"})
        }
        const hashpsw = await bcrypt.hash(password, 10)
        const user = await new User({
            username,
            email,
            password: hashpsw
        }).save()
        const token = await user.generateAuthToken()
        console.log(token)
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

userroutes.patch('/login', async (req,res)=>{
    const {email, password} = req.body
    try {
        // if(req.token){
        //     return res.status(400).send({"error": "Already Logged In"})
        // }
        if(!email || !password){
            return res.status(400).send({"error": "Please provide both email and password"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).send({"error": "User not exist"})
        }

        const ismatch = await bcrypt.compare(password, user.password)
        if(!ismatch){
            return res.status(400).send({"error": "Invalid email or password"})
        }

        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

userroutes.get('/profile', auth , async (req,res)=>{
    try {
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
})

// userroutes.post('/logout',auth, async (req,res)=> {
    
//     try {
//         req.user.tokens = []
//         req.user.save()
//         res.status(200).send({"message": "Logout Successfully"})
//     } catch (err) {
//         res.status(400).json({"error": err.message})
//     }

// })
userroutes.get('/logout',auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send({"message": "Logout Successfully"})
    });

}); 


module.exports = userroutes