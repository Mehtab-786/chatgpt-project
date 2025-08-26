const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');
const { generateContent, generateVectors } = require("../services/ai.services");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require('../services/vector.services');

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

            /*
            const message = await messageModel.create({
                content: messagePayload.content,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: "user"
            })

            const vectors = await generateVectors(messagePayload.content)
            */

            const [message, vectors] = await Promise.all([
                messageModel.create({
                    content: messagePayload.content,
                    user: socket.user._id,
                    chat: messagePayload.chat,
                    role: "user"
                }),
                generateVectors(messagePayload.content)
            ])


            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })

            /*
            const memory = await queryMemory({
                queryVectors: vectors,
                limit: 3,
                metadata: {
                    user: socket.user._id
                }
            })

            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({ createdAt: -1 }).limit(4).lean()).reverse()
            */

            const [memory, chatHistory] = await Promise.all([
                await queryMemory({
                    queryVectors: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),
                (await messageModel.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(4).lean()).reverse()

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
                        text: `these are some previous message from the chat , use them to generate response ${memory.map(item => item.metadata.text).join("\n")}`
                    }]
                }
            ]

            const response = await generateContent([...ltm, ...stm])

            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

            const responseMessage = await messageModel.create({
                content: response,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: "model"
            })

            const responseVectors = await generateVectors(response)

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })

        })

    });

}
module.exports = socketServer