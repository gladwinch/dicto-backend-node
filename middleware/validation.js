const ajv = require('../services/ajv')

function validationMiddleware(schemaPath) {
    return (req, res, next) => {
        const validSchema = require(schemaPath)

        let key = req.method + '_' + req.url.split('?')[0]
        let schema = validSchema[key]

        if(!schema) {
            return res.status(500).json({ 
                success: false, 
                errors: "Please add validation schema" 
            })
        }

        let params = req.method === 'GET' ? req.query : req.body

        const isDataValid = ajv.validate(schema, params)

        if(!isDataValid) {
            return res.status(400).json({ 
                success: false, 
                errors: ajv.errors 
            })
        }

        next()
    }
}

module.exports = validationMiddleware