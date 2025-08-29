const express = require('express')
const {createChat} = require('../controllers/chat.controllers')
const { userAuth } = require('../middlewares/userAuth.middlewares')
const chatRouter = express.Router()

chatRouter.post('/', userAuth, createChat )

module.exports = chatRouter