const UserDataAccessLayer = require('./user.dal')
const UserModel = require('./user.model')
const UserService = require('./user.service')
const validationSchema = require('./user.validation')

const userDAL = new UserDataAccessLayer({ 
    model: UserModel, 
    markup: false 
})

module.exports = { 
    userDAL,
    userService: UserService({ userDAL }),
    validationSchema
}