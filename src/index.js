const express = require("express")
require('./db/mongoose')
const userroutes = require('./routes/user')
const bikeTypeRoutes = require('./routes/bike_type')
const bikeRoutes = require('./routes/bike')
const bodyparser=require('body-parser');

const app = express()
const port = process.env.PORT


app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use('/user', userroutes)
app.use('/bike-type', bikeTypeRoutes)
app.use('/bike', bikeRoutes)


app.listen(port, ()=> {
    console.log("Server running on port", port)
})