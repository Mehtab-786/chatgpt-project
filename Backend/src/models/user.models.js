const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,        
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps:true})

const userModel = mongoose.model('user',userSchema)

module.exports = userModel