const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	description: {
		type: String
	},
	published: {
		type: Boolean,
		default: false
	},
	admins: [{
		type:Schema.Types.ObjectId,
		ref: 'User'
	}],
	guests: [{
		type:Schema.Types.ObjectId,
		ref: 'User'
	}],
	// array of strings
	categories: {
		type: [String]
	},
	suggestions: {
		type: [String]
	}
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;