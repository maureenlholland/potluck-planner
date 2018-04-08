const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
		unique: true,
		type: String
	},
	password: {
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

userSchema.pre('save', function(next) {
	const user = this;
	// hash if existing user has changed password
	// hash if user is new
	if (user.isModified('password') || user.isNew) {
		bcrypt.hash(user.password, 10, (err, hash) => {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	} else {
		return next();
	}
});

// add a method to the user schema
userSchema.methods.comparePassword = function(password) {
	// bycrypt can compare a plaintext password to a hashed password
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;