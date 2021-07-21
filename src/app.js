'use strict'
const express = require("express")
const filmRoute = require("./filmroute")
const userRoute = require("./userroute")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/film', filmRoute)
app.use('/user', userRoute)
app.use('/', function(req, res) { res.send('Welcome Api')} )

const listener = app.listen(
  process.env.PORT || 10889,
  () => {
    const myport = listener.address().port
    console.log(`Server is ready at ${myport}`)
  }
)