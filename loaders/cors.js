const cors = require('cors')

// These are web server details
const WEB_SERVER_HOST = process.env.WEB_SERVER_HOST || "localhost"
const WEB_SERVER_PORT = process.env.WEB_SERVER_PORT || 3000

module.exports = app => {
    app.use(
        cors({
            credentials: true,
            origin: [
                'http://localhost:3000',
                'https://dicto.io',
                'http://localhost:2000',
                'http://65.0.70.81:2000'
            ]
        })
    )
}