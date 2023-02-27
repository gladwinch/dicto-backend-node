const express = require('express')
const router = express.Router()
const axios = require('axios')

const { wordService: ws } = require('./index.js')

// search meaning
router.get('/', async (req, res, next) => {
    const { search } = req.query

    const [
        sentences,
        definition,
        synonyms,
        phonetics
    ] = await Promise.all([
        ws.getSentences(search),
        ws.getDefinition(search),
        ws.getSynonyms(search),
        ws.getPhonetics(search)
    ])
    

    res.json({
        success: true,
        data: {
            sentences,
            definition,
            synonyms,
            phonetics
        }
    })
})

// search meaning
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

    result = result.data.map(i => i.word).filter(w=> !w.includes(' '))
    
    res.status(200).json({
        success: true, 
        data: result
    })

    ws.createWord(
        result.map(w =>({ word: w }))
    )
})

// helper fn

module.exports = router