const Ajv = require("ajv")
const addFormats = require("ajv-formats")

const ajv = new Ajv({
    allErrors: true
})

module.exports = addFormats(ajv)