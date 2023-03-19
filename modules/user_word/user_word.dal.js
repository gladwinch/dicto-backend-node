const DataAccessLayer = require('../../services/dataAccessLayer')

class UserDataAccessLayer extends DataAccessLayer {
    constructor({ model, markup }) {
        super()
        this.model = model
        this.markup = !!markup
    }

    async getUserWords(userId) {
        return await this.model.find({ userId })
    }
}

module.exports = UserDataAccessLayer