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
		type: String,
		default: 'https://picsum.photos/200?image=1062'
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