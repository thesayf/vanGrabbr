// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var jobsSchema = mongoose.Schema({
    name		: String,
    email       : String,
    password    : String,
    salt        : String,
	//crmId    	: String,
    fromAddress : String,
    toAddress   : String,
    saveEmail   : Boolean,
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Jobs', jobsSchema);
