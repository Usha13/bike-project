const express = require("express")
require('./db/mongoose')
const userroutes = require('./routes/user')
const bikeTypeRoutes = require('./routes/bike_type')
const bikeRoutes = require('./routes/bike')

const app = express()
const port = process.env.PORT


app.use(express.json())
app.use('/user', userroutes)
app.use('/bike-type', bikeTypeRoutes)
app.use('/bike', bikeRoutes)


app.listen(port, ()=> {
    console.log("Server running on port", port)
})