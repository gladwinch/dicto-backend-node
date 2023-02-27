require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')

async function fn() {
    let word = 'get'
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'+word

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

async function magenta() {
    let x = await fn()

    console.log(x)
}

magenta()