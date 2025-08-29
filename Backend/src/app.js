//importing modules
require('dotenv').config()
const express = require('express')
const userRouter = require('./routes/user.routes')
const chatRouter = require('./routes/chat.routes')
const cookieParser = require('cookie-parser')


//initialization
const app = express()

//middlewares setup                 
app.use(cookieParser())
app.use(express.json())


//routes setup
app.use('/api/auth', userRouter)
app.use('/api/chat', chatRouter)

module.exports = app