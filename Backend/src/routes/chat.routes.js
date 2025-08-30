const express = require('express')
const {createChat, getChats, getMessages} = require('../controllers/chat.controllers')
const { userAuth } = require('../middlewares/userAuth.middlewares')
const chatRouter = express.Router()

chatRouter.post('/', userAuth, createChat )

chatRouter.get('/', userAuth, getChats )

chatRouter.get('/messages/:id', userAuth, getMessages )

module.exports = chatRouter