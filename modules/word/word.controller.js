const express = require('express')
const router = express.Router()
const axios = require('axios')
const search = require('../../middleware/search')
const { wordService: ws } = require('./index.js')
const uwService = require('../user_word')

// @desc      Search word
// @route     GET /api/word
// @access    Public
router.get('/', search, async (req, res) => {
    const { search } = req.query
    let response = null

    if(!search) return res.json(null)

    const payload = { 
        word: search,
        fields: {
            sentences: 0,
            synonyms: 0,
            phonetics: 0,
            definitions: 0
        },
        api_key: process.env.DICTO_EX_API_KEY
    }

    const result = await ws.findWord(search)
    
    if(!result) payload.fields = {
        sentences: 1,
        synonyms: 1,
        phonetics: 1,
        definitions: 1
    }

    if(result && !result.sentences && !result.sentences.length) payload.fields.sentences = 1
    if(result && !result.synonyms && !result.synonyms.length) payload.fields.synonyms = 1
    if(result && !result.phonetics && !result.phonetics.length) payload.fields.phonetics = 1
    if(result && !result.definitions && !result.definitions.length) payload.fields.definitions = 1

    let extract = false

    for (const [_, value] of Object.entries(payload.fields)) {
        if(value) extract = true
    }

    response = ws.parseResult(result)

    if(!extract && response) {
        res.status(200).json(response)

        // save user word
        if(req.userId && response._id) uwService.createUW({
            userId: req.userId,
            word: response.word
        })

        return
    }

    const { data } = await axios.post(
        process.env.DICTO_EX_API, payload
    )

    if (
        !data.data || 
        !data.data.definitions || 
        !data.data.definitions.length
    ) {
        return res.status(200).json(null)
    }

    let word

    if(result && result._id) {
        word = await ws.updateWord(result._id, data.data)
    } else {
        word = await ws.createWord({
            word: search,
            ...data.data
        })
    }

    response = ws.parseResult(word)
    res.status(200).json(response)

    // save user word
    if(req.userId && word.word) uwService.createUW({
        userId: req.userId,
        word: word.word
    })
})

// @desc      Search auto complete word
// @route     GET /api/word/auto-complete
// @access    Public
router.get('/auto-complete', async function(req, res, next) {
    const link = process.env.AUTO_COMPLETE_API
    const _b = req.query

    if(!_b.word) {
        return res.status(400).json({ 
            success: false,
            message: "Please provide word" 
        })
    }

    let result = await axios.get(link+_b.word)
    result = result.data.map(i => i.word).filter(w=> !w.includes(' ')).slice(0, 4)
    
    res.status(200).json(result)
})

module.exports = router