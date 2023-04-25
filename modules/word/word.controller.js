const express = require('express')
const router = express.Router()
const axios = require('axios')
const search = require('../../middleware/search')
const { wordService: ws } = require('./index.js')
const uwService = require('../user_word')
const { userService: us } = require('../user/index')

// @desc      Search word
// @route     GET /api/word
// @access    Public
router.get('/', search, async (req, res) => {
    return res.status(200).json(null)
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
        if(req.userId && response._id) {
            uwService.createUW({
                userId: req.userId,
                word: response.word
            })
        }

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
            _meta: {
                training: false
            },
            ...data.data
        })
    }

    response = ws.parseResult(word)
    res.status(200).json(response)

    // save user word
    if(req.userId && word.word) {
        uwService.createUW({
            userId: req.userId,
            word: word.word
        })
    }
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

// @desc      Send notification
// @route     GET /api/word/notification
// @access    Public
let NCONFIG = {
    'N': 5, 'L': 3, 'P': 2, 'K': 1
}

router.post('/notification', async function(req, res, next) {
    try {
        if(req.body.api_key !== process.env.DICTO_EX_API_KEY) {
            return res.status(401).send("Unauthorize!")
        }

        let users = await us.getProUser()
        users = users.filter(u => u.fcmToken)
    
        const nConf = { ...NCONFIG }
    
        for (let prop in nConf) {
            if (nConf[prop] === 0) {
                delete nConf[prop]
            }
        }
    
        if(!NCONFIG['N'] && !NCONFIG['L'] && !NCONFIG['P'] && !NCONFIG['K']) {
            NCONFIG = {
                'N': 5, 'L': 3, 'P': 2, 'K': 1
            }
    
            return res.send("RESET")
        }
    
        const keys = Object.keys(nConf)
        const randomIndex = Math.floor(Math.random() * keys.length)
        const selectedKey = keys[randomIndex]
        NCONFIG[selectedKey] = NCONFIG[selectedKey] - 1
    
        res.status(200).json(NCONFIG)
    
        console.log('NCONFIG: ', NCONFIG)
        for(let user of users) {
            const tableMap = {
                'N': 'new',
                'L': 'learn',
                'P': 'practice',
                'K': 'known', 
            }
            
            let uwList = await uwService.readUW(user._id)
    
            if(uwList && uwList.length) {
                uwList = JSON.parse(JSON.stringify(uwList))
                let wArr = uwList.filter(x => x.table === tableMap[selectedKey])
                if(!wArr.length) wArr = uwList
    
                const wInx = Math.floor(Math.random() * wArr.length)
                const word = wArr[wInx]
                let sentence = ""
                const sentences = word.wordId.sentences
    
                if(sentences.length) {
                    let sInx = Math.floor(Math.random() * sentences.length)
                    sentence = sentences[sInx]
                }
    
                // update user_word
                const uwpayload = {
                    notified: word.notified + 1
                }
    
                if(word.notified >= 10) uwpayload.table = function() {
                    const tabs = ['new','learn','practice','known','master']
                    const tabInx = tabs.indexOf(word.table)
    
                    return tabs[tabInx + 1]
                }()
    
                console.log('uwpayload -> ', uwpayload)
    
                await uwService.updateUW(word._id, uwpayload)
    
                // send notification
                const notificationData = {
                    "to": user.fcmToken,
                    "notification": {
                        "body": sentence,
                        "title": word.word,
                        "subtitle": tableMap[selectedKey]
                    }
                }
    
                console.log(notificationData)
    
                const notificationResult = await axios.post(
                    'https://fcm.googleapis.com/fcm/send', 
                    notificationData, 
                    {
                        headers: {
                            'Authorization': process.env.FCM_SERVER_KEY
                        }
                    }
                )
    
                console.log(notificationResult.data)
            }
        }   
    } catch (error) {
        console.log('[ERROR] > user/notification', error)
    }
})

module.exports = router