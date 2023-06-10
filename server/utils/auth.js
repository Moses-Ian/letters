const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '..', '.env')});

const secret = process.env.JWT_SECRET;
const expiration = '48h';

const isTokenExpired = (token) => {
	try {
		const decoded = jwt.decode(token);
		if (decoded.exp < Date.now() / 1000) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
};

module.exports = {
  signToken: function({ username, email, dailyHints, lastLogin, _id }) {
    const payload = { username, email, dailyHints, lastLogin, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
	authMiddleware: function({ req }) {
		// allows token to be sent via req.body, req.query, or headers
		let token = req.body.token || req.query.token || req.headers.authorization;

		// separate "Bearer" from "<tokenvalue>"
		if (req.headers.authorization) {
			token = token
				.split(' ')
				.pop()
				.trim();
		}

		// if no token, return request object as is
		if (!token) {
			return req;
		}

		try {
			// decode and attach user data to request object
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log('Invalid token');
		}

		// return updated request object
		return req;
	},
  // retrieve data saved in token
  getProfile: function(token) {
    return token ? jwt.decode(token) : token;
  },
  // check if the token has expired
  // isTokenExpired: function(token) {
  // },
  // check if the user is still logged in
  loggedIn: function(token) {
    return !!token && !isTokenExpired(token);
  },

};
