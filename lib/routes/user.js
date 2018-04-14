// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file
const User = require('../models/user');
const { verifyToken } = require('../middleware/authentication');

router.get('/current', verifyToken, (req, res) => {
	const { user } = req.token;
	if (user && user.id) {
		User
			.findById(user.id)
			.populate('events')
			.then(user => {
				res.status(200).json({
					message: 'success',
					payload: user
				});
			});
	} else {
		res.status(401).json({
			message: 'forbidden'
		});
	}
});

router.get('/:user', (req, res) => {
	const {user} = req.params;
	// error handle for email = undefined
	User 
		.findOne({ email: user })
		.then(doc => {
			res.status(200).json({
				message: 'success',
				payload: doc
			})
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			})
		});
});

// Also needed in every route!!!
module.exports = router;