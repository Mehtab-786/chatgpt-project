const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.models')

async function userRegister(req,res) {
    const {username, email, password} = req.body

    const isUser = await userModel.findOne({email})

    if (isUser) {
        return res.status(409).json({
            message:"Username or email already taken"
        })
    }


    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        email,
        username,
        password:hashedPassword
    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    
    res.cookie('token', token)

    return res.status(201).json({
        message:"user registered successfully",
        user
    })
}

async function userLogin(req,res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(404).json({
            message:"Email or password is incorrect"
        })
    }
    
    const isPassword = await bcrypt.compare(password,user.password)

    if (!isPassword) {
        return res.status(404).json({
            message:"Email or password is incorrect"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    
    res.cookie('token', token)

    return res.status(200).json({
        message:"user logged in successfully",
        user
    })
}


module.exports = {userRegister, userLogin}