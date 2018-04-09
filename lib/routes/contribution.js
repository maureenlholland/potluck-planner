// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file

router.post('/create', (req, res) => {
	const name = req.body.name;
	const user = req.body.user;

	// Instantiate a new category
	const contribution = new Contribution({
		name: name,
		userId: user
	});
	// Save new contribution to database
	contribution
		.save()
		.then(doc => {
			res.status(201).json({
				message: 'created contribution!',
				payload: doc
			})
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			})
		})
});

// Also needed in every route!!!
module.exports = router;