const jwt = require('jsonwebtoken')
const User = require('./user.model')

// create user with payload
const create = async (payload) => {
    const user = await User.findOne({ email: payload.email })

    if(user) {
        return user
    }

    return await User.create(payload)
}

// get user list with pagination
const read = userDAL => async (query) => {
    return await userDAL.read(query)
} 

// get single user
const getUser = userDAL => async (query) => {
    return await userDAL.getUser(query)
}

// get single user
const updateUser = userDAL => async (id, payload) => {
    return await userDAL.updateById(id, payload)
}

const getProUser = async () => {
    return await User.find({
        // :TODO pro user query
    }).select({ name: 1, email: 1, fcmToken: 1 })
}

// generate token for user auth
const generateToken = (payload) => {
    const token = jwt.sign(
        payload, 
        process.env.JWT_TOKEN_API_SECRET, 
        { expiresIn: '720h' }
    )
    
    return token
}

// send token via cookie
const sendCookie = (res, token) => {
    let cookieOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production'
    }

    if(process.env.NODE_ENV === 'production') {
        cookieOptions.domain = process.env.MAIN_DOMAIN
        cookieOptions.sameSite = 'none'
        cookieOptions.httpOnly = true
    }

    res.cookie('auth-token', token, cookieOptions)
}

module.exports = ({ userDAL }) => {
    return {
        create,
        read: read(userDAL),
        getUser: getUser(userDAL),
        updateUser: updateUser(userDAL),
        getProUser,
        generateToken,
        sendCookie
    }
}