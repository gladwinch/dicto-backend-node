const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const search = require('../../middleware/search')
const uws = require('./index.js') // user word service

// @desc      Create user word
// @route     GET /api/word_user
// @access    Private
router.get('/', auth, async(req, res) => {
    try {
        let uwList = await uws.readUW(req.user._id)
        uwList = JSON.parse(JSON.stringify(uwList))

        // bring up the definition that has pos
        for(let x of uwList) {
            if (x.wordId.definitions[0].partOfSpeech === '') {
                let inx = x.wordId.definitions.findIndex(o => o.partOfSpeech)
            
                if(inx) {
                    let item = x.wordId.definitions[0]
                    x.wordId.definitions[0] = x.wordId.definitions[inx]
                    x.wordId.definitions[inx] = item
                }
            }
        }

        // add pos and def to main object
        uwList = uwList.map(w => {
            return {
                ...w,
                wordId: {
                    pos: w.wordId.definitions[0].partOfSpeech ? w.wordId.definitions[0].partOfSpeech.split("[")[0].trim().toLowerCase() : '',
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

// @desc      Update user word
// @route     PUT /api/word_user
// @access    Private
router.put('/', auth, async(req, res) => {
    try {
        const _b = req.body
        await uws.updateUW(_b._id, _b.payload)

        res.status(201).json({
            success: true
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }   
})

// @desc      Create user word
// @route     POST /api/word_user
// @access    Private
router.post('/', search, async(req, res) => {
    try {
        const _b = req.body
        await uws.createUW({
            userId: req.userId,
            word: _b.word
        })

        res.status(201).json({
            success: true
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }   
})

module.exports = router