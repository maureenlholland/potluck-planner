const jwt = require('jsonwebtoken');
const config = require('../config.json');

// refactor plans:
// export three functions: issueToken, verifyToken, findUserByEmail

const auth = (req, res, next) => {
	const authHeader = req.get('authorization');
	// check for auth header
	if (!authHeader) {
		res.status(401).json({
			message: 'unauthorized'
		});
	}

	// verify token sent with auth header
	const token = authHeader.split(" ")[1];
	jwt.verify(token, config.secret, (err, decoded) => {
		if (decoded) {
			// set decoded token on req object
			req.token = decoded;
			next();
		} else {
			res.status(401).json({
				message: 'forbidden'
			})
		}
	})
}

module.exports = {
	auth
}

