const DataAccessLayer = require('../../utils/dataAccessLayer')

class UserDataAccessLayer extends DataAccessLayer {
    constructor({ model, markup }) {
        super()
        this.model = model
        this.markup = !!markup
    }
}

module.exports = UserDataAccessLayer