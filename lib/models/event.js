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
	creator: {
		type:Schema.Types.ObjectId,
		ref: 'User'
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
		type: [{
			suggestions: [{
				name: {
					type: String
				},
				category: {
					type: Number
				},
				claimed: {
					type: Boolean,
					default: false
				}
			}],
			contributions: [{
				type: Schema.Types.ObjectId,
				ref: 'Contribution'
			}],
			name: String
		}]
	},
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;