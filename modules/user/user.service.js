const jwt = require('jsonwebtoken')

// create user with payload
const create = userDAL => async (payload) => {
    return await userDAL.create(payload)
}

// get user list with pagination
const read = userDAL => async (query) => {
    return await userDAL.read(query)
} 

// get single user
const getUser = userDAL => async (query) => {
    return await userDAL.getUser(query)
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    if(process.env.NODE_ENV === 'production') {
        cookieOptions.domain = process.env.MAIN_DOMAIN
        cookieOptions.sameSite = 'none'
    }

    res.cookie('auth-token', token, cookieOptions)
}

module.exports = ({ userDAL }) => {
    return {
        create: create(userDAL),
        read: read(userDAL),
        getUser: getUser(userDAL),
        generateToken,
        sendCookie
    }
}