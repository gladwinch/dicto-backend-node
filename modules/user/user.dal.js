const DataAccessLayer = require('../../services/dataAccessLayer')

class UserDataAccessLayer extends DataAccessLayer {
    constructor({ model, markup }) {
        super()
        this.model = model
        this.markup = !!markup
    }

    async getUser(query) {
        return await this.model.findOne(query)
    }
}

module.exports = UserDataAccessLayer