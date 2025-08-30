const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.models")
const { generateContent, generateVectors } = require('../services/ai.services')
const messageModel = require('../models/message.models')
const { createMemory, queryMemory } = require('../services/vector.services')

function socketServer(httpServer) {
    const io = new Server(httpServer, {
        cors:{
            origin:'http://localhost:5173',
            credentials:true,
            allowedHeaders: [ "Content-Type", "Authorization" ],
        }
    });

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

            const [userMessage, vectors] = await Promise.all([
                await messageModel.create({
                    user: socket.user._id,
                    role: "user",
                    content: message.content,
                    chat: message.chat
                }),
                await generateVectors(message.content)
            ])

            await createMemory({
                vectors,
                messageId: userMessage._id,
                metadata: {
                    user: socket.user._id,
                    chat: message.chat,
                    text: message.content
                }
            })


            const [memory, chatHistory] = await Promise.all([
                await queryMemory({
                    queryVectors: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),
                await messageModel.find({ chat: message.chat }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })
            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `these are some previous messages from the chat, use them to generate a response 
                        ${memory.map(item => item.metadata.text).join("\n")}
                        `
                    }]
                }
            ]

            const response = await generateContent([...ltm, ...stm])

            socket.emit('ai-response', { response })

            const [queryVectors, aiMessage] = await Promise.all([
                await generateVectors(response),
                await messageModel.create({
                    user: socket.user._id,
                    role: "model",
                    content: response,
                    chat: message.chat
                })
            ])

            await createMemory({
                vectors: queryVectors,
                messageId: aiMessage._id,
                metadata: {
                    user: socket.user._id,
                    chat: message.chat,
                    text: response
                }
            })
        })
    });
}

module.exports = { socketServer }