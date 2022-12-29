const express = require('express')

module.exports = (app) => {
    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ extended: true }))
}