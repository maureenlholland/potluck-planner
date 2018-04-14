// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file
const Event = require('../models/event');
const Contribution = require('../models/contribution');

router.post('/create', (req, res) => {
	const name = req.body.name;
	const user = req.body.user;
	const userId = String(user._id);
	const eventId = req.body.eventId;
	const categoryId = req.body.category._id;

	// Instantiate a new contribution
	const contribution = new Contribution({
		name: name,
		category: categoryId,
		user: userId
	});
	// Save new contribution to database
	// "categories.$.contributions.$._id": String(contributionId) won't work because there are two positional operators: 
	contribution
		.save()
		.then(doc => {
			const contributionId = doc._id;
			Event
				.update({ 
						"_id": eventId,
						"categories._id": String(categoryId)
					},
					{ $addToSet:
					    {
					      "categories.$.contributions": String(contributionId)
					    }
					}
				)
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					console.log(err);
				})
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

router.delete('/:contribution/:category/:event', (req, res) => {
	const contributionId = req.params.contribution;
	const categoryId = req.params.category;
	const eventId = req.params.event;
	// const categoryId = req.body.category
	Contribution
		.findByIdAndRemove(contributionId)
		.then(doc => {
			Event
				.update({ 
						"_id": eventId,
						"categories._id": String(categoryId)
					},
					{ $pull:
					    {
					      "categories.$.contributions": String(contributionId) 
					    }
					}
				)
				.then(doc => {
					console.log(doc);
				})
				.catch(err => {
					console.log(err);
				})
			res.status(202).json({
				message: 'removed!',
				payload: doc
			})
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			});
		});
});

// Also needed in every route!!!
module.exports = router;