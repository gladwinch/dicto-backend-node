const jwt = require('jsonwebtoken')

function search(req, res, next) {
	const token = req.cookies['auth-token']

	if (!token) return next()

	try {
		const decoded = jwt.verify(token, process.env.JWT_TOKEN_API_SECRET)
		req.userId = decoded.userId

		next()
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Internal server error' })
	}
}

module.exports = search