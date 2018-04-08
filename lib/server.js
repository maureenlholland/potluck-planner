// Connect to Express (Node)
const express = require('express');
// Connect to Mongoose (MongoDB)
const mongoose = require('mongoose');
// config for env variables
const config = require('config');
// create path 
const path = require('path');
// Allow body in requests
const bodyParser = require('body-parser');
// JWT Auth
const jwt = require('jsonwebtoken');

// Internal dependencies
const User = require('./models/user');
const Event = require('./models/event');
const Contribution = require('./models/contribution');
const tokenService = require('./tokenService');
const { auth } = require('./middleware/authentication');

const PORT = process.env.PORT || config.PORT;
const uri = process.env.MONGODB_URI || config.MONGODB_URI;
mongoose.connect(uri);
const app = express();

// Tell app to recognize info sent in body of request
app.use(bodyParser.json());

app.use('/', express.static(
		path.join(__dirname, '../build')
));

// EVENTS API
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
			console.log(err);
			res.status(500).json({
				message: err.message
			})
		});
});

// Create API endpoints
app.get('/event/:id', (req, res) => {
	const id = req.params.id;
	Event 
		.findById(id)
		.then(doc => {
			res.status(200).json({
				message: 'success',
				payload: doc
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: err.message
			})
		});
});

// Check CORS error possibility (added proxy, then realized it already exists)
// Ensure Datetime is store in usable format
app.post('/events', (req, res) => {
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
		categories: categories
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

// CONTRIBUTIONS API
app.post('/contributions', (req, res) => {
	console.log(req.body);
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

// USERS API
/*  use ES6 destructuring to save variables throughout */
app.post('/signup', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	const user = new User({
		firstName,
		lastName,
		email,
		password
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
});

app.post('/login', (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).then(user => {
		if (user) {
			user
				.comparePassword(password)
				.then(isMatch => {
					if (isMatch) {
						const token = tokenService.createToken(user);
						res.status(200).json({
							message: 'success',
							payload: token
						});
					} else {
						res.status(401).json({
							message: 'unauthorized'
						});
					}
				}) 
				.catch(err => {
					res.status(500).json({
						message: err.message
					})
				})
		} else {
			res.status(401).json({
				message: 'unauthorized'
			});
		}
	});
});

app.get('/user/current', auth, (req, res) => {
	// grab id from req object set by middleware
	const { id } = req.token.user;
	User
		.findById(id)
		.then(doc => {
			if (doc) {
				res.status(200).json({
					message: 'found user!',
					payload: doc
				});
			} else {
				res.status(401).json({
					message: 'forbidden - user not found'
				});
			}
		})

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});