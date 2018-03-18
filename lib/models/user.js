const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
		required: true,
		type: String
	},
	lastName: {
		required: true,
		type: String
	},
	email: {
		required: true,
		type: String
	},
	avatar: {
		type: String,
		default: 'http://fillmurray.com/g/200/300'
	},
	// get an array of event objects
	events: [{
		type: Schema.Types.ObjectId, 
		ref: 'Event' 
	}]

});

const User = mongoose.model('User', userSchema);

module.exports = User;