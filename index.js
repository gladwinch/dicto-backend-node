const express = require('express')
const loaders = require('./loaders')
const axios = require('axios')

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

app.get('/message', async (req, res) => {
    try {
        const data = await axios(process.env.DICTO_EX_API+'/message')
        console.log(data.data)   
        res.json(data.data)
    } catch (error) {
        console.log("ERROR > ", error)
    }
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