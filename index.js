var express         = require('express');
var app             = express();
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require ('express-session');
var passport        = require('passport');
var localStrategy   = require('passport-local').Strategy;
var needle          = require('needle');
var rest            = require('restler');
var crypto = require('crypto');


var Quote       = require(__dirname + '/server/models/quote');
var Token       = require(__dirname + '/server/models/token');
var User        = require(__dirname + '/server/models/user');
var Contact     = require(__dirname + '/server/models/contact');
var Driver     = require(__dirname + '/server/models/driver');
var Staff     = require(__dirname + '/server/models/staff');


// DB configuration ============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

// Set Port ====================================================================
app.set('port', (process.env.PORT || 5002));

// Passport
app.use(session({secret: 'this is the secret'}));
app.use(cookieParser('this is the secret'));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// routes ==================================================
require(__dirname + '/server/routes')(app, Quote, Token, User, Contact, needle, rest, Driver, Staff);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
