const Event = require('../models/event');

const updateEvent = (req, res, next) => {
	console.log('running update');
	const contributionId = req.contribution;
	const eventId = req.body.eventId;
	const categoryId = req.body.category._id;
	Event
		.update({ 
				"_id": eventId,
				"categories._id": String(categoryId)
			},
			{ $addToSet:
			    {
			      "categories.$.contributions": String(contributionId)
			    }
			}
		)
		.then(res => {
			res.status(202).json({
				message: 'modified event'
			})
			next();
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			})
			next();
		})
}


module.exports = {
	updateEvent
}