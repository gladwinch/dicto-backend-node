const UserDataAccessLayer = require('./user.dal')
const UserModel = require('./user.model')
const UserService = require('./user.service')
const UserDAL = new UserDataAccessLayer({ 
    model: UserModel, markup: false 
})

module.exports = { 
    UserDAL,
    UserService: UserService({ UserDAL })
}