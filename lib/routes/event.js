// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file
const Event = require('../models/event');

router.get('/:userId', (req, res) => {
	Event
		.find({ creator: req.params.userId })
		.then(doc => {
			res.status(200).json({
				message: 'success',
				payload: doc
			})
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			});
		})
});

router.get('/:eventId', (req, res) => {
	const id = req.params.id;
	console.log('getting event');
	Event 
		.findById(id)
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

router.post('/create', (req, res) => {
	// Grab all form elements
	const title = req.body.title;
	const date = req.body.date; /* Needs to be in datetime format from separate date and time inputs on React form */
	const address = req.body.address;
	const image = req.body.image;
	const description = req.body.description;
	/*const published = req.body.published;  publish automatically for now
							allow event drafts to be saved later */
	
	
	// const guests = ['userId'];
	const creator = req.body.creator;
	const categories = req.body.categories;
	// const suggestions = req.body.suggestions;
	// Instantiate a new event
	const event = new Event({
		title: title,
		date: date,
		address: address,
		image: image,
		description: description,
		published: true,
		categories: categories,
		creator: creator
	});
	// Save new event to database
	event
		.save()
		.then(doc => {
			res.status(201).json({
				message: 'created event!',
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