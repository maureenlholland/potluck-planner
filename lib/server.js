// Connect to Express (Node)
const express = require('express');
// Allow path
const path = require('path');
// Connect to Mongoose (MongoDB)
const mongoose = require('mongoose');
// Allow body in requests
const bodyParser = require('body-parser');
// Create express instance
const app = express();
// Use compartmentalized routes
const router = require('./routes');
// Use environment variables
const config = require('config');
// Set port through production or development
const PORT = process.env.PORT || config.PORT;
// Set database through production or development
const uri = process.env.MONGODB_URI || config.MONGODB_URI;
// Connect with mongo
mongoose.connect(uri);

// Tell app to recognize info sent in body of request *Must be above router call*
app.use(bodyParser.json());
// Tell app to use router files
app.use(router);


// Set up production
app.use('/', express.static(
		path.join(__dirname, '../build')
));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});