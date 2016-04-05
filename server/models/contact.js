// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var contactSchema = mongoose.Schema({
    organization    : String,
    name            : String,
    relationship    : String,
    userID          : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);
