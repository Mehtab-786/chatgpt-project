const mongoose = require('mongoose')

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to database')        
    } catch (err) {
        console.log('Connection to database',err)
    }
}

module.exports = connectToDb