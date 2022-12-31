require('dotenv').config()
require('colors')
require('./mongoose')

const expressJson = require('./express_json')
const morgan = require('./morgan')
const requestId = require('./requestId')
const passport = require('./passport')
const cors = require('./cors')
// const helmet = require('./helmet')
// const errorHandler = require('./error_handler')
// const bugSnagHandler = require('./bugsnag')
// const responseTime = require('./response_time')

const env = process.env.NODE_ENV !== 'production'

module.exports = app => {
    expressJson(app)
    morgan(app)
    requestId(app)
    passport(app)
    cors(app)
//   bugSnagHandler(app)
//   helmet(app)
//   if (env) {
//     errorHandler(app)
//     responseTime(app)
//   }
}