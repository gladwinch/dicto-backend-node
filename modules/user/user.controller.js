const express = require('express')
const router = express.Router()
const { userService } = require('./index.js')

// create user
router.post('/', async(req, res, next) => {
    try {
        const _b = req.body
        // :TODO validation
        let userData = await userService.create(_b)

        res.json(userData)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// login user
router.post('/login', async(req, res, next) => {
    try {
        const _b = req.query
        // console.log('the query: ', _b)
        let userData = await userService.read()
        res.json(userData)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// get user
router.get('/', async(req, res, next) => {
    try {
        const _b = req.query
        // console.log('the query: ', _b)
        let userData = await userService.getUser(_b._id)
        res.json(userData)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

module.exports = router