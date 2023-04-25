const express = require('express')
const router = express.Router()

const Word = require("../word/word.model")
const { wordService: wService } = require('../word')
const samples = require('./words.json')

// @desc      Trainer
// @route     GET /api/trainer
// @access    Private
router.get('/', async(req, res) => {
    try {
        console.log('aoi called')
        const _q = req.query
        let cwords = await Word.find({ 
            word: { $in: samples }
        }).lean()

        cwords = cwords.map(w => w.word)

        const aSet = new Set(cwords)
        const data = samples.filter(item => !aSet.has(item))

        let current = data[0]
        let index = samples.indexOf(current)

        res.json({
            progress: ((data.length/samples.length) * 100) - 100,
            current: data[0],
            index: index + 1
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }   
})

// @desc      update single sample
// @route     PUT /api/traniner/sample
// @access    Private
router.post('/', async(req, res) => {
    try {
        const _b = req.body
        if (
            _b.word &&
            _b.sentences && 
            _b.sentences.length &&
            _b.synopsis &&
            _b.morpheme.length
        ) {
            const payload = {
                word: _b.word,
                sentences: _b.sentences,
                synopsis: _b.synopsis,
                morpheme: _b.morpheme
            }

            console.log('payload -> ', payload)
            const word = await wService.findWord(_b.word)

            if(word) {
                await wService.updateWord(word._id, payload)
            } else {
                await wService.createWord(payload)
            }

            return res.json({ success: true })
        }

        res.json({ success: false })
    } catch (error) {
        console.error(error)

        return res.status(500).json({ 
            message: 'Internal server error' 
        })
    }   
})

module.exports = router