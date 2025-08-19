const userModel =  require('../models/user.model')
const jwt = require('jsonwebtoken')
async function authUser(req,res,next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message:"User not logged in"
        })
    }

    try {
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({message:"User unauthorized"})
    }
}

module.exports = {authUser}