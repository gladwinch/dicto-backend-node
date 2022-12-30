// data access layer
class DataAccessLayer {
    async create(payload={}) {
        return await this.model.create(payload)
    }

    async updateById(id, payload={}) {
        return await this.model.findOneAndUpdate({ _id: id }, payload, {
            upsert: true,
            new: true
        })
    }

    async updateMany({ query={}, payload={} }) {
        return await this.model.updateMany(query, payload)
    }

    async getById(id) {
        return await this.model.findById(id)
    }

    async read(_query={}) {
        let query

        const reqQuery = { ..._query }
        const removeFields = ['select', 'sort', 'page', 'limit', 'populate']

        removeFields.forEach(param => delete reqQuery[param])
        let queryStr = JSON.stringify(reqQuery)

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        query = this.model.find(JSON.parse(queryStr))

        if (_query.select) {
            const fields = _query.select.split(',').join(' ')
            query = query.select(fields)
        }

        if (_query.sort) {
            const sortBy = _query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // Pagination
        const page = parseInt(_query.page, 10) || 1
        const limit = parseInt(_query.limit, 10) || 25
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const total = await this.model.countDocuments(JSON.parse(queryStr))

        query = query.skip(startIndex).limit(limit)

        if (_query.populate) {
            query = query.populate(_query.populate)
        }

        const results = await query
        const pagination = {}

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        return {
            success: true,
            count: results.length,
            pagination,
            data: results
        }
    }

    async remove(id) {
        return await this.model.findOneAndUpdate(
            { _id: id }, 
            { deleted: true }, 
            { upsert: true, new: true }
        )
    }

    async delete(id) {
        return await this.model.deleteOne({ _id: id })
    }
}

module.exports = DataAccessLayer