const DataAccessLayer = require('../../services/dataAccessLayer')

class UserDataAccessLayer extends DataAccessLayer {
    constructor({ model, markup }) {
        super()
        this.model = model
        this.markup = !!markup
    }

    async getUserByEmail(email) {
        return await this.model.findOne({ email })
    }
}

module.exports = UserDataAccessLayer