const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const uws = require('./index.js') // user word service

// @desc      Create user
// @route     POST /api/word_user
// @access    Public
router.get('/', auth, async(req, res) => {
    try {
        const resArr = []
        let uwList = await uws.readUW(req.user._id)

        uwList = JSON.parse(JSON.stringify(uwList))
        uwList = uwList.map(w => {
            return {
                ...w,
                wordId: {
                    pos: w.wordId.definitions[0].partOfSpeech,
                    definition: w.wordId.definitions[0].definition.charAt(0).toUpperCase() + w.wordId.definitions[0].definition.slice(1),
                    ...w.wordId
                }
            }
        })



        return res.status(200).json(uwList)
    } catch (error) {
        console.error(error)

        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }   
})

module.exports = router