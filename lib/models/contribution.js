const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
	name: String,
	category:  String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;