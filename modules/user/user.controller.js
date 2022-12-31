const express = require('express')
const router = express.Router()
const passport = require('passport')
const { userService } = require('./index.js')
const auth = require('../../middleware/auth')

// create user
router.post('/', async(req, res, next) => {
    try {
        const data = await userService.create(req.body)
        res.json({ success: true, data })
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// login user
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.status(400).json({ 
                success: false, 
                errors: ['password or email incorrect']
            })
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({ success: true, data: user });
        })
    })(req, res, next)
})

// get user
router.get('/', auth, async(req, res, next) => {
    try {
        res.status(200).json({ 
            success: true, 
            data: req.user 
        })
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
          console.log(err)
          res.send('Error logging out')
        } else {
            req.session.destroy(function(err) {
                if (err) {
                    console.log(err)
                    res.send('session is not destroyed!')
                } else {
                    res.send('successful')
                }
            });
        }
    })
})

router.get('/sessions', (req, res) => {
    req.sessionStore.all((err, sessions)=>{
        res.json(sessions)
    })
})

module.exports = router