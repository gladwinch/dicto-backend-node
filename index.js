const express = require('express')
const loaders = require('./loaders')

// app configuration
let app = express()

//app config
loaders(app)

// Routers
app.use(
    '/api',
    require("./config/path").include(express.Router())
)

const server = app.listen(
    process.env.PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1))
})