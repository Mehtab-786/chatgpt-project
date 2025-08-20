const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');
const generateContent = require("../services/ai.services");
const messageModel = require("../models/message.model");

function socketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake?.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Authentication error : No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()

        } catch (error) {
            next(new Error("Authentication error : Invalid token"));
        }

    });


    io.on("connection", (socket) => {

        socket.on('ai-message', async (messagePayload) => {

            await messageModel.create({
                content: messagePayload.content,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: "user"
            })

            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({createdAt : -1}).limit(4).lean()).reverse()

            console.log("chatHistory :", chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))

            const response = await generateContent(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))

            await messageModel.create({
                content: response,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: "model"
            })
            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })
        })

    });

}

module.exports = socketServer