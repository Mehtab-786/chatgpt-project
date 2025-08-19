const chatModel = require("../models/chat.model")

async function createChat(req, res) {
    const { title } = req.body
    const user  = req.user

    const chat = await chatModel.create({
        title,
        user: user._id
    })

    res.status(201).json({
        message: "chat created succesfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActity: chat.lastActivity
        }
    })
}

module.exports = { createChat }