const chatModel = require('../models/chat.models')
const messageModel = require('../models/message.models')

async function createChat(req, res) {
    const { title } = req.body

    const chat = await chatModel.create({
        title,
        user: req.user._id
    })

    return res.status(201).json({
        message: "New chat created",
        chat
    })
}

async function getChats(req, res) {
    const user = req.user

    const chat = await chatModel.find({ user: user._id })

    return res.status(200).json({
        message: "Chats retrived successfully",
        chats: chat.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    })
}

async function getMessages(req, res) {
    const chatId = req.params.id

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
    
    return res.status(200).json({
        message: "Messages retrived successfully",
        messages:messages
    })
}


module.exports = { createChat, getChats, getMessages }