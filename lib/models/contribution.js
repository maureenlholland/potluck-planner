const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
	name: String,
	// on contributions collection find with event ID
	eventId: {
		type: Schema.Types.ObjectId,
		ref: 'Event'
	},
	category: String 
});

const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;