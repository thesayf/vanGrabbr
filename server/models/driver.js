// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var driverSchema = mongoose.Schema({
    username       : String,
    password       : String,
    email          : String,
    firstname      : String,
    lastname       : String,
    mobile         : String,
    day            : String,
    month          : String,
    year           : String,
    address        : String,
    city           : String,
    postcode       : String,
    vehicle        : String,
    reg            : String,
    porters        : String,
    vehiclenumber  : String,
    bank           : String,
    acc            : String,
    sc             : String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Driver', driverSchema);
