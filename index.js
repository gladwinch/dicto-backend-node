const express = require('express')
const loaders = require('./loaders')

// app configuration
let app = express()

//app config
loaders(app)

// Routers
app.set('trust proxy', 1)
app.use(
    '/api',
    require("./config/path").include(express.Router())
)

app.get('/ping', (req, res) => {
    res.send('pong')
})

const server = app.listen(
    process.env.PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `:${process.env.PORT}`.cyan
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1))
})