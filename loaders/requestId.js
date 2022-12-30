function requestIdMiddleware(req, res, next) {
    const requestId = `${Date.now()}-${Math.random()}`
    req.requestId = requestId

    next()
}

module.exports = (app) => {
    app.use(requestIdMiddleware)
}