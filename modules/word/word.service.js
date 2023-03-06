const findWord = wordDAL => async (word) => {
    return await wordDAL.findOne({ word })
}

const createWord = wordDAL => async (payload) => {
    return await wordDAL.create(payload)
}

const updateWord = wordDAL => async (id, payload) => {
    return await wordDAL.updateById(id, payload)
}

module.exports = ({ wordDAL }) => {
    return {
        createWord: createWord(wordDAL),
        findWord: findWord(wordDAL),
        updateWord: updateWord(wordDAL)
    }
}