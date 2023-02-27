const DataAccessLayer = require('../../services/dataAccessLayer')

class WordDataAccessLayer extends DataAccessLayer {
    constructor({ model, markup }) {
        super()
        this.model = model
        this.markup = !!markup
    }
}

module.exports = WordDataAccessLayer