const UserWord = require('./user_word.model')

// create user with payload
const createUW = async ({ userId, word }) => {
    const uwExist = await UserWord.findOne({ word, userId })

    if(!uwExist) {
        let d = await UserWord.create({ userId, word })
        return d
    }
}

const readUW = async (userId) => {
    return await UserWord.find({ userId }).populate('wordId')
}

const updateUW = async (_id, payload) => {
    return await UserWord.updateOne({ _id }, payload)
}

module.exports = {
    createUW,
    readUW,
    updateUW
}