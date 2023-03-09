function auth(req, res, next) {
    console.log('cookie -< ',req.headers)

    if(!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized")
    }

    next()
}

module.exports = auth