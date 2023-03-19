const findWord = wordDAL => async (word) => {
    return await wordDAL.findOne({ word })
}

const createWord = wordDAL => async (payload) => {
    return await wordDAL.create(payload)
}

const updateWord = wordDAL => async (id, payload) => {
    return await wordDAL.updateById(id, payload)
}

const parseResult = word => {
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

module.exports = ({ wordDAL }) => {
    return {
        createWord: createWord(wordDAL),
        findWord: findWord(wordDAL),
        updateWord: updateWord(wordDAL),
        parseResult
    }
}