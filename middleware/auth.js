const jwt = require('jsonwebtoken')

function auth(req, res, next) {
	const token = req.cookies['auth-token'];

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_TOKEN_API_SECRET)
		req.user = {
			_id: decoded.userId,
			email: decoded.email
		}

		next()
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = auth;