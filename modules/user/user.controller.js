const express = require('express')
const router = express.Router()

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

// @desc      Create notification token for user
// @route     POST /api/notification
// @access    Public
router.post('/notification', async (req, res) => {
    try {
        const _b = req.body

        if(!_b.email || !_b.notificationId) {
            return res.json({ success: false, message: "Invalid request" })
        }
        
        const user = await us.getUser({ email: _b.email })
        let d = await us.updateUser(user._id, { 
            notificationId: _b.notificationId 
        })

        console.log(d)

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