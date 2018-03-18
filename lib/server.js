// Connect to Express (Node)
const express = require('express');
// Connect to Mongoose (MongoDB)
const mongoose = require('mongoose');
// Allow body in requests
const bodyParser = require('body-parser');

// Internal dependencies
const User = require('./models/user');
const Event = require('./models/event');
const Contribution = require('./models/contribution');

const PORT = 8080;
const uri = 'mongodb://localhost:27017/potluck';
mongoose.connect(uri);
const app = express();

// Tell app to recognize info sent in body of request
app.use(bodyParser.json());

// Create API endpoints
app.get('/events', (req, res) => {
	Event 
		.find()
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

// Check CORS error possibility (added proxy, then realized it already exists)
// Ensure Datetime is store in usable format
app.post('/events', (req, res) => {
	console.log(req.body);
	// Grab all form elements
	const title = req.body.title;
	const date = req.body.date; /* Needs to be in datetime format from separate date and time inputs on React form */
	const address = req.body.address;
	const image = req.body.image;
	const description = req.body.description;
	/*const published = req.body.published;  publish automatically for now
							allow event drafts to be saved later */
	// const admins = ['userId']; 
	// const guests = ['userId'];
	// const categories = req.body.categories;
	// const suggestions = req.body.suggestions;
	// Instantiate a new event
	const event = new Event({
		title: title,
		date: date,
		address: address,
		image: image,
		description: description,
		published: true
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

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});