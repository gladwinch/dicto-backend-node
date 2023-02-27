const WordDataAccessLayer = require('./word.dal')
const WordModel = require('./word.model')
const WordService = require('./word.service')
const validationSchema = require('./word.validation')

const wordDAL = new WordDataAccessLayer({ 
    model: WordModel, 
    markup: false 
})

module.exports = { 
    wordDAL,
    wordService: WordService({ wordDAL }),
    validationSchema
}