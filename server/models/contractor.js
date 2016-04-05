// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var contractorSchema = mongoose.Schema({
    firstname       : String,
    lastname        : String,
    email           : String,
    phonenumber     : String,
    birthday        : Number,
    birthmonth      : String,
    birthyear       : Number,
    addressline1    : String,
    addressline2    : String,
    city            : String,
    postcode        : String,
    vantype         : String,
    porters         : String,
    reg             : String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Contractor', contractorSchema);
