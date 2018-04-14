// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Dependencies specific to this file
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Troubleshooting routes and params and variables (they have to match!!!)
router.get('/:id', (req, res) => {
	const {id} = req.params;
	Event 
		.findById(id)
		.populate('guests')
		.populate('admins')
		.populate({
			path: 'categories.contributions',
			populate: {
				path: 'user'
			}
		})
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
	const { 
		title,
		date, 
		address,
		image,
		description,
		categories,
		admins, 
		guests
	 } = req.body;
	// change array of guest objects to array of guest ids
	const filterIds = guests.map(guest => String(guest._id) );
	const adminId = admins.map(admin => String(admin._id));
	// Instantiate a new event
	const event = new Event({
		title: title,
		date: date,
		address: address,
		image: image,
		description: description,
		published: true,
		categories: categories,
		admins: adminId,
		guests: filterIds
	});
	// Save new event to database
	event
		.save()
		.then(doc => {
			const admins = doc.admins;
			const guests = doc.guests;
			const attendees = admins.concat(guests);
			User
				.updateMany(
					{ _id: {$in: attendees} },
					{ $addToSet:
					      {
					        events: String(doc._id)
					      }
					}
				)
				.then(doc => {
					console.log(doc);
				})
				.catch(err => {
					console.log(err);
				})
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

router.put('/suggestion/claim', (req, res) => {
	console.log(req.body.suggestion);
	const { event, suggestion, claimed } = req.body;
	const index = suggestion.category;
	const category = event.categories[index];
	const categoryId = category._id;
	const suggestionId = suggestion._id;
	Event
		.update({ 
				"_id": event._id
			},
			{ $set:
			    {
			      "categories.$[cat].suggestions.$[index].claimed": true
			    }
			},
			{
				arrayFilters: [ 
					{ "cat._id": ObjectId(categoryId) },
					{ "index._id": ObjectId(suggestionId) }
				]
			}
		)
		.then(doc => {
			console.log('success');
			res.status(202).json({
				message: 'updated suggestion',
				payload: doc
			})
		})
		.catch(err => {
			console.log('server error');
			res.status(500).json({
				message: err.message
			})
		})
});

router.put('/suggestion/remove', (req, res) => {
	const { event, contribution, claimed } = req.body;

	const categoryId = contribution.category;
	const suggestionName = contribution.name;
	
	Event
		.update({ 
				"_id": event._id
			},
			{ $set:
			    {
			      "categories.$[cat].suggestions.$[sug].claimed": false
			    }
			},
			{
				arrayFilters: [ 
					{ "cat._id": ObjectId(categoryId) },
					{ "sug.name": suggestionName }
				]
			}
		)
		.then(doc => {
			console.log('success');
			res.status(202).json({
				message: 'updated suggestion',
				payload: doc
			})
		})
		.catch(err => {
			console.log('server error');
			res.status(500).json({
				message: err.message
			})
		})
})


// Also needed in every route!!!
module.exports = router;