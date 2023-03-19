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

module.exports = ({ userWordDAL }) => {
    return {
        createUW,
        readUW
    }
}