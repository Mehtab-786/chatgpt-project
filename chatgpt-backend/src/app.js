require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/user.routes')

const app = express()
app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRouter)


module.exports = app