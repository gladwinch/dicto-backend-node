const create = userDAL => async (payload) => {
    return await userDAL.create(payload)
}

const read = userDAL => async (query) => {
    return await userDAL.read(query)
} 

const getUser = userDAL => async (query) => {
    return await userDAL.getUser(query)
}

module.exports = ({ userDAL }) => {
    return {
        create: create(userDAL),
        read: read(userDAL),
        getUser: getUser(userDAL)
    }
}