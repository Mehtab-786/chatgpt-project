const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.models")
const { generateContent } = require('../services/ai.services')
const messageModel = require('../models/message.models')

function socketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies) {
            next(new Error('User not authenticated'))
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        } catch (err) {
            console.log('Authentication error !!', err)
            next(new Error('User not authenticated'))
        }
    })

    io.on("connection", (socket) => {

        socket.on('ai-message', async (message) => {

            await messageModel.create({
                user: socket.user._id,
                role: "user",
                content: message.content,
                chat: message.chat
            })

            const chatHistory = (await messageModel.find({ chat: message.chat }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

            const response = await generateContent(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))

            await messageModel.create({
                user: socket.user._id,
                role: "model",
                content: response,
                chat: message.chat
            })

            socket.emit('ai-reply', { response })
        })
    });
}

module.exports = { socketServer }