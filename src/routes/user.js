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
        const user =  new User({
            username,
            email,
            password: hashpsw
        })
        const u = await user.save()
        const token = await u.generateAuthToken()
        console.log(token)
        res.status(201).send({user:u, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

userroutes.post('/login', async (req,res)=>{
    const {email, password} = req.body
    try {
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
    } catch (e) {
        res.status(400).send(e.message)
    }
})

userroutes.get('/me', auth , async (req,res)=>{
    try {
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})


module.exports = userroutes