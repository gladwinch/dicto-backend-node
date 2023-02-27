const cheerio = require('cheerio')
const axios = require('axios')
const promisifier = require('../../services/promisifier')

const createWord = wordDAL => async (payload) => {
    console.log('payload: ', payload)
    return wordDAL.create(payload,'word')
}

const getDefinition = async (word) => {
    if(!word) return null

    const result = await axios.get(process.env.GET_DEFINITION_SRC+word)
    const $ = cheerio.load(result.data)

    let defination = $('.ddef_d').text() || ''
    return defination.split(':').map(s => s.trim())
}

const getSynonyms = async (word) => {
    let url = 'https://api.api-ninjas.com/v1/thesaurus?word=' + word

    const { data } = await axios(
        url,
        {
            headers: {
                'X-Api-Key': process.env.NINJA_API_KEY
            }
        }
    )

    return data
}

const getSentences = async (word) => {
    if(!word) return null

    let { data } = await axios.get(process.env.GET_SENTENCE_API+word)

    const $ = cheerio.load(data)
    let sentense = []
    $('.sentence-item')
    .each((i, el) => sentense.push($(el).text()))

    sentense = (sentense || []).sort((a,b) => a.length - b.length).map(i => i.trim()).slice(0,30)
    return sentense
}

const getPhonetics = async (word) => {
    if(!word) return null

    let url = process.env.PHONETICS_URI+word

    const { data } = await axios(url)

    let phonetics = []
    if(data[0] && data[0].phonetics.find(x => x.audio)) {
        let ph = data[0].phonetics.find(x => x.audio)
        phonetics.push({
            lang: 'general', text: ph.text, audio: ph.audio
        })
    }

    let pos = ''
    if(data[0] && data[0].meanings && data[0].meanings[0]) {
        pos = data[0].meanings[0].partOfSpeech
    }

    let meaning = []
    if(
        data[0] && 
        data[0].meanings && 
        data[0].meanings[0] && 
        Array.isArray(data[0].meanings[0].definitions)
    ) {

        for(let i = 0; i < data[0].meanings[0].definitions.length; i++) {
            if(
                data[0].meanings[0].definitions[i] && 
                data[0].meanings[0].definitions[i].definition
            ) {
                meaning.push(data[0].meanings[0].definitions[i].definition)
            }
        }
    }
    
    return {
        phonetics,
        pos,
        meaning
    }
}

module.exports = ({ wordDAL }) => {
    return {
        createWord: createWord(wordDAL),
        getSynonyms: getSynonyms,
        getDefinition: getDefinition,
        getSentences: getSentences,
        getPhonetics: getPhonetics
    }
}