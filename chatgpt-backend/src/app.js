require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/user.routes')
const chatRouter = require('./routes/chat.routes')
const cors = require('cors')

const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)


module.exports = app