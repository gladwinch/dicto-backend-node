require('dotenv').config()
require('colors')
require('./mongoose')

const expressJson = require('./express_json')
const morgan = require('./morgan')
const requestId = require('./requestId')
// const helmet = require('./helmet')
// const errorHandler = require('./error_handler')
// const bugSnagHandler = require('./bugsnag')
// const responseTime = require('./response_time')
const passport = require('./passport')

const env = process.env.NODE_ENV !== 'production'

module.exports = (app) => {
    expressJson(app)
    morgan(app)
    requestId(app)
    passport(app)
//   bugSnagHandler(app)
//   helmet(app)
//   if (env) {
//     errorHandler(app)
//     responseTime(app)
//   }
}