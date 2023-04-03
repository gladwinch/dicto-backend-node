const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const axios = require('axios')

const auth = require('../../middleware/auth')
const { userService: us } = require('./index.js')

// @desc      Create user
// @route     POST /api/user
// @access    Public
router.post('/', async(req, res, next) => {
    try {
        const _b = req.body
        const user = await us.create(_b)
        delete user.password

        const token = us.generateToken({ 
            userId: user._id, 
            email: user.email 
        })

        us.sendCookie(res, token)
        return res.json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }
})

// @desc      Login user
// @route     POST /api/user/login
// @access    Public
router.post('/login', async (req, res, next) => {
    try {
        const _b = req.body
        let user = await us.getUser({ email: _b.email })

        if(!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            })
        }

        const isMatch = await user.matchPassword(_b.password)
        if(!isMatch) return res.status(401).json({ 
            message: 'Invalid email or password' 
        })
        
        user = user.toObject()
        delete user.password

        const token = us.generateToken({ 
            userId: user._id, 
            email: user.email 
        })

        us.sendCookie(res, token)
        return res.json(user)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc      Get loggedin user
// @route     GET /api/user
// @access    Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await us.getUser({ _id: req.user._id })
        res.status(200).json(user)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// @desc      Get google hook
// @route     GET /api/user/google
// @access    Public
router.get('/google', async (req, res) => {
    try {
        const code = req.query.code
        const url = "https://oauth2.googleapis.com/token"
        const values = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
            grant_type: "authorization_code",
        }

        let data 
        try {
            data = await axios.post(url, values, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
        } catch (error) {
            console.log(error)
        }

        const { access_token, id_token } = data.data
        let googleRes

        try {
            googleRes = await axios
            .get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
                { 	headers: {
                        Authorization: `Bearer ${id_token}`,
                    }
                }
            )
        } catch (error) {
            console.log(error)
            throw new Error
        }

        const userData = {
            name: googleRes.data.name,
            email: googleRes.data.email,
            avatar: googleRes.data.picture,
            organization: googleRes.data.hd,
            googleId: googleRes.data.id
        }

        // check if user exist
        let user = await us.create(userData)

        const payload = {
            userId: user._id,
            email: user.email
        }

        // generate auth token
        const token = jwt.sign(
            payload, 
            process.env.JWT_TOKEN_API_SECRET, 
            { expiresIn: '720h' }
        )
    
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
        res.redirect(process.env.BACK_REDIRECT_URL)
    } catch (error) {
        console.log('[ERROR] user/google', error)
    }
})

// @desc      Create notification token for user
// @route     POST /api/notification
// @access    Public
router.post('/notification', async (req, res) => {
    try {
        const _b = req.body

        if(!_b.email || !_b.fcmToken) {
            return res.json({ success: false, message: "Invalid request" })
        }
        
        const user = await us.getUser({ email: _b.email })

        if(!user) {
            return res.json({ success: false, message: "Invalid request" })
        }

        await us.updateUser(user._id, { 
            fcmToken: _b.fcmToken 
        })

        res.status(200).json({  message: "Notification added" })
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// @desc      Logout user
// @route     GET /api/user/logout
// @access    Public
router.get('/logout', (req, res) => {
    res.clearCookie('auth-token')
    res.status(200).json({ 
        message: 'Logged out successfully' 
    })
})

module.exports = router