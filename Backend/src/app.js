//importing modules
require('dotenv').config()
const express = require('express')
const userRouter = require('./routes/user.routes')
const chatRouter = require('./routes/chat.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path');


//initialization
const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

//middlewares setup                 
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));


//routes setup
app.use('/api/auth', userRouter)
app.use('/api/chat', chatRouter)



app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app