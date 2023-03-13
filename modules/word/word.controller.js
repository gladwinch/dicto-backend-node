const express = require('express')
const router = express.Router()
const axios = require('axios')

const { wordService: ws } = require('./index.js')

// search meaning
router.get('/', async (req, res) => {
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

    response = parseResult(result)

    if(!extract && response) {
        return res.status(200).json(response)
    }

    const { data } = await axios.post(
        process.env.DICTO_EX_API, payload
    )

    console.log('data -< .... >', data.data)

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

    response = parseResult(word)
    res.status(200).json(response)
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
    result = result.data.map(i => i.word).filter(w=> !w.includes(' ')).slice(0, 4)
    
    res.status(200).json(result)
})

// helper fn

function parseResult(word) {
    if(!word || !word.definitions || !word.definitions[0]) return null

    let parsedRes = JSON.parse(JSON.stringify(word))
    let hasPosInx = parsedRes.definitions.findIndex(r => r.partOfSpeech.length)

    if(hasPosInx > 0 && hasPosInx !== -1) {
        let swapEl = parsedRes.definitions[0]
        parsedRes.definitions[0] = parsedRes.definitions[hasPosInx]
        parsedRes.definitions[hasPosInx] = swapEl
    }

    return {
        ...parsedRes,
        definitions: parsedRes.definitions.map(r => {
            return {
                ...r,
                partOfSpeech: (r && r.partOfSpeech) ? r.partOfSpeech.split("[")[0].trim().toLowerCase() : '',
                definition: (r && r.definition) ? r.definition.charAt(0).toUpperCase() + r.definition.slice(1) : ''
            }
        }),
        phonetics: parsedRes.phonetics.map(r => {
            return {
                ...r,
                text: r.text ? r.text.replace('//','/') : ''
            }
        }),
        synonyms: parsedRes.synonyms.map(r => r.replace('_', ' '))
    }
}

module.exports = router