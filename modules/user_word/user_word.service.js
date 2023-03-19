const UserWord = require('./user_word.model')

// create user with payload
const createUW = async ({ userId, wordId }) => {
    const uwExist = await UserWord.findOne({ wordId, userId })

    if(!uwExist) {
        return await UserWord.create({ userId, wordId })
    }
}

const readUW = async (userId) => {
    return await UserWord.find({ userId }).populate('wordId')
}

const updateUW = async (_id, payload) => {
    return await UserWord.updateOne({ _id }, payload)
}

module.exports = ({ userWordDAL }) => {
    return {
        createUW,
        readUW,
        updateUW
    }
}