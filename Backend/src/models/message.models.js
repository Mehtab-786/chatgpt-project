const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model", "system"],
        default: "user"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
}, {
    timestamps: true
})

const messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel