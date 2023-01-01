const cors = require('cors')

// These are web server details
const WEB_SERVER_HOST = process.env.WEB_SERVER_HOST || "localhost"
const WEB_SERVER_PORT = process.env.WEB_SERVER_PORT || 3000

module.exports = app => {
    app.use(
        cors({
            credentials: true,
            origin: [
                // "http://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT,
                // "https://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT
                'http://localhost:3000',
                'https://localhost:3000',
                'https://dicto-dev.onrender.com'
            ]
        })
    )
}