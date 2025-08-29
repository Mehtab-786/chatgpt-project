const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected')
    } catch (err) {
        console.log('Error while MongoDB connection !!', err)
    }
}

module.exports = connectDB