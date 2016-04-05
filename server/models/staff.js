// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var staffSchema = mongoose.Schema({
    username       : String,
    password       : String,
    email          : String,
    firstname      : String,
    lastname       : String,
    position       : String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Staff', staffSchema);
