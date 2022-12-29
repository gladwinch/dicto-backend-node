const create = AdminDAL => async (payload) => {
    console.log('AdminDAL: ', AdminDAL)
    console.log('payload: ', payload)
    return await AdminDAL.create(payload)
}

const read = AdminDAL => async (query) => {
    return await AdminDAL.read(query)
} 

module.exports = ({ AdminDAL }) => {
    return {
        create: create(AdminDAL),
        read: read(AdminDAL)
    }
}