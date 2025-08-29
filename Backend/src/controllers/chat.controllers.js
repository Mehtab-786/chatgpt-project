const chatModel = require('../models/chat.models')

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

module.exports = { createChat }