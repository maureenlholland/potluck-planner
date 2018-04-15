// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file
const { findUserByEmail, issueToken } = require('../middleware/authentication');
const User = require('../models/user');

// Declare routes
router.post('/login', findUserByEmail, issueToken);

router.post('/signup', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	const avatar = 'http://fillmurray.com/g/200';
	const user = new User({
		firstName,
		lastName,
		email,
		password, 
		avatar
	});
	user
		.save()
		.then(doc => {
			res.status(201).json({
				message: 'created user!',
				payload: doc
			});
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			});
		})
})

// Also needed in every route!!!
module.exports = router;