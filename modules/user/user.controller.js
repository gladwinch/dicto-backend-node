const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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

        const token = generateToken({ 
            userId: user._id, 
            email: user.email 
        })

        res.cookie('auth-token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            domain: '.dicto-web-app-vg5nh.ondigitalocean.app',
            sameSite: 'none',
            path: '/'
        })

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

        const token = generateToken({ 
            userId: user._id, 
            email: user.email 
        })

        res.cookie('auth-token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            domain: '.dicto-web-app-vg5nh.ondigitalocean.app',
            sameSite: 'none',
            path: '/'
        })

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

// @desc      Logout user
// @route     GET /api/user/logout
// @access    Public
router.get('/logout', (req, res) => {
    res.clearCookie('auth-token')
    res.status(200).json({ 
        message: 'Logged out successfully' 
    })
})

// --------------------------- services ----------------------------
function generateToken(payload) {
    const token = jwt.sign(
        payload, 
        process.env.JWT_TOKEN_API_SECRET, 
        { expiresIn: '720h' }
    )
    
    return token
}

module.exports = router