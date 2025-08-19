const express = require('express')
const authMiddleware = require('../middlewares/auth.middlewares')
const chatRouter = express.Router()
const chatControllers = require('../controllers/chat.controllers')

chatRouter.post('/', authMiddleware.authUser,chatControllers.createChat )

module.exports = chatRouter