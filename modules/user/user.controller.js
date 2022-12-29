const express = require('express')
const router = express.Router()
const { UserService } = require('./index.js')

// create user
router.post('/', async(req, res, next) => {
    try {
        const _b = req.body
        // :TODO validation
        let userData = await UserService.create(_b)

        res.json(userData)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// get user
router.get('/', async(req, res, next) => {
    try {
        const _b = req.query
        console.log('the query: ', _b)
        let userData = await UserService.read(_b)
        res.json(userData)
    } catch (error) {
        console.log('ERROR: ', error)
    }
})

// router.get('/google', async(req, res, next) => {
//     try {
//         const _b = req.query
//         console.log('the query: ', _b)
        
//         res.json({ success: true, query: _b })
//     } catch (error) {
//         console.log('ERROR: ', error)
//     }
// })

// router.get('/login', async(req, res, next) => {
//     let data = await AdminService.analytics()
//     console.log('the data: ', data)
//     res.send(data)
// })

// router.get('/logout', adminController.logout)
// router.get('/', adminController.getUser)

module.exports = router