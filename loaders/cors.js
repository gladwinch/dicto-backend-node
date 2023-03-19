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
                'https://localhost:3000',
                'https://dicto-web-app-vg5nh.ondigitalocean.app',
                'https://dicto.io'
            ]
        })
    )
}