var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var td = require(__dirname + '/controllers/td.js');
var pp = require(__dirname + '/controllers/passport.js');
var stripePay = require(__dirname + '/controllers/stripe.js');
var crypto = require('crypto');

var func = require(__dirname + '/controllers/func.js');
var jwt = require('jsonwebtoken');

//td.getFinalCost(bookingID, 'TDOBkkz4aH2ACzJ6Uw1aHH19', function() {})


module.exports = function(app, Quote, Token, User, Contact, needle, rest, Driver, Staff) {

    app.post('/webhooks/td-status', function(req, res) {
        var statusNews = req.body.payload;

        // Decode base64
        var statusNews = new Buffer(statusNews, 'base64')
        var en = statusNews.toString('binary');
        var iv = en.substr(0, 16);
        var data = en.substr(16);
        var password = 'secretaeskey1234';
        var decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
        decipher.setAutoPadding(false);
        var decoded  = decipher.update(data);
        decoded += decipher.final();

        var mongoData = {};
        mongoData.col = Quote;
        mongoData.fields = ["status"];
        mongoData.newValues = [decoded.new_booking_status];
        mongoData.selector = 'userID';
        mongoData.selectorVal = userID;
        mongoData.pullBack = true;

        func.updateMongoFields(mongoData, function(status) {
            if(status._id) {
                // updated
                // IF TD DRIVER COMPLETES JOB
                if(decoded.new_booking_status == "completed") {
                    // GET FINAL price
                    pp.getUserID(req.cookies['remember_me'], function(userID) {
                        // GET ACCESS TOKEN & STRIPE ID FROM DB
                        var mongoData = {};
                        mongoData.col = User;
                        mongoData.selector = '_id';
                        mongoData.selectorVal = userID;
                        mongoData.fields = {"stripeID":1, "source":1, "accessToken":1};
                        getMongoFields(mongoData, function(respo) {
                            // GET FINAL COST FROM TD
                            td.getFinalCost(decoded.booking_pk, respo.accessToken, function(bookingData) {
                                // STRIPE CHARGE
                                var price = bookingData.booking.total_cost.value;
                                stripePay.chargeCustomer(price, respo.stripeID, respo.cardID, function() {
                                    // ALSO SAVE PRICE TO MONGO
                                })
                            })
                        })
                    })
                }

            } else {
                console.log(status);
            }
        })

    })

    /////  CONTACTS  /////
    app.post('/api/contactlist', function (req, res) {
        Contact.find({'userID': req.user._id}, function (err, docs) {
            res.json({
                success:true,
                message: "Saved",
                status: 1,
                data:docs
            })
        });
    });

    app.post('/api/add-contact', function (req, res){
        var contact = new Contact();
        contact.userID = req.user._id;
        contact.organization = req.body.contact.organization;
        contact.name = req.body.contact.name;
        contact.relationship = req.body.contact.relationship;
        console.log(req.body);
        contact.save(function(err, user){
            if(err){
                return done(err);
            } else {
                res.json({
                    success:true,
                    message: "Saved",
                    status: 1
                })
            }
        });
    });


	/////  LOGIN SYSTEM  /////
    app.post("/api/login", passport.authenticate('local'), function(req, res){
        pp.issueToken(req.user, function(err, token) {
            res.cookie('remember_me', token, { maxAge: 604800000 });
            if (err) {return next(err);}
            //return next();
        });
		res.json(req.user);
	});

	app.post("/api/signin", passport.authenticate('local-admin'), function(req, res){
		res.json(req.staff);
	});

    app.post("/api/driversignin", passport.authenticate('local-driver'), function(req, res){
		res.json(req.driver);
	});

	// logs the user out by deleting the cookie
	app.post("/api/logout", function(req, res){
		req.logOut()
		res.json(req.user);
	});

    app.post("/api/login-auth",  function(req, res) {
        if(req.cookies['remember_me']) {
            pp.getToken(req.cookies['remember_me'], function(toke) {
                if(toke){
                    if(req.cookies['remember_me'] == toke) {
                        res.send(true ? req.user : '0');
                    }
                } else {
                    res.send(req.isAuthenticated() ? req.user : '0');
                }
            });
        } else {
            res.send(false);
        }
	});

	//authenitcates staff login
	app.post("/api/signin-auth",  function(req, res) {
		res.send(req.isAuthenticated() ? req.staff : '0');
	});

    //This registers the Users
	app.post("/api/register", function(req, res){

        //req.body.username = 'test';

		User.findOne({username: req.body.username}, function(err, user){
			if(user){
			 	return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
		   		var user = new User();
				user.username = req.body.username;
				user.password = req.body.password;
				user.email = req.body.email;
				user.businessname = req.body.businessname;
				user.address = req.body.address;
				user.doornumber = req.body.doornumber;
				user.city = req.body.city;
				user.postcode = req.body.postcode;
				user.businesstype = req.body.businesstype;
				user.firstname = req.body.firstname;
				user.lastname = req.body.lastname;
				user.mobile = req.body.mobile;
				/*user.username = 'test';
				user.password = '123';
				user.email = 'test004@test.com';
				user.businessname = 'test biz';
				user.address = 'test address';
				user.doornumber = '103';
				user.city = 'test city';
				user.postcode = 'cr77jj';
				user.businesstype = 'tester';
				user.firstname = 'test first';
				user.lastname = 'test last';
				user.mobile = '+447894564410';*/

                // Save to mongo
				user.save(function(err, user){
                    // Create Tdispatch account for user
                    td.createAccount(user, function(data) {
                        // Save xtra details from tdisptch to user db
                        td.saveAccountDetails(User, data, user, function() {
                            req.login(user, function(err){
                                if(err) {
                                    return res.json({
                                        success: false,
                                        message: "Sorry you have been unable to login at this time, please try again later"
                                    });
                                }
                                return res.json({
                                    success: true,
                                });
                            });
                        })
                    })
				});
			} //else close
		});
	});

    app.post('/api/check-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'cardAdded':1, 'cardID':1, 'stripeID':1}, function(data) {
                if(data.cardAdded) {
                    stripePay.getCard(data.stripeID, data.cardID, function(cardData) {
                        var cardDetails = {};
                        if(cardData) {
                            cardDetails.brand = cardData.brand;
                            cardDetails.last4 = cardData.last4;
                        }
                        return res.json({
                            success: true,
                            message: 'added',
                            data: cardDetails
                        });
                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'none',
                        data: data
                    });
                }
            })
        })
    })

    app.post('/api/remove-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'stripeID':1, 'cardID':1}, function(fields) {
                stripePay.deleteCard(fields.stripeID, fields.cardID, function(status) {
                    var tempFields = ["stripeID", "cardID", "cardAdded"];
                    var tempValues = [undefined, undefined, undefined];
                    func.updateUserFields(userID, tempFields, tempValues, function(status) {
                        console.log(status);
                        if(status == true) {
                            return res.json({
                                success: true,
                                message: 'card removed',
                            })
                        } else {
                            return res.json({
                                success: false,
                                message: status
                            })
                        }
                    })
                })
            })
        })
    })

    app.post('/api/add-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'pk':1, 'email':1, 'stripeID':1}, function(userFields) {
                //combine fields for stripe
                var userData = {};
                userData.email = userFields.email;
                userData.pk = userFields.pk;
                userData.id = userID;
                userData.tokenID = req.body.id;
                //IF uSER ALREDY STRIPED
                if(userFields.stripeID) {
                    stripePay.addCard(userFields.stripeID, userData.tokenID, function(cardData) {
                        if(cardData.id == true) {
                            //SAVE TO MONGO
                            stripePay.saveCardData(cardData, userData.id, function(status) {
                                if(status == true) {
                                    return res.json({
                                        success: true,
                                        message: 'card added'
                                    })
                                } else {
                                    return res.json({
                                        success: false,
                                        message: status
                                    })
                                }
                            })

                        } else {
                            return res.json({
                                success: false,
                                message: 'no card id found'
                            })
                        }
                    })
                } else {
                    // Create Cutomer In Stripe
                    stripePay.createCustomer(userData, function(stripeInfo) {
                        // Save Stripe ID in MONGO
                        stripePay.saveCustomerData(stripeInfo, function(status) {
                            // IF STRIPE SAVED LOG IN
                            if(status == true) {
                                return res.json({
                                    success: true,
                                    msg: 'Added Card'
                                });
                            } else {
                                return res.json({
                                    success: false,
                                    msg: 'No Card Added'
                                });
                            }
                        })
                    })
                }
            })
        })
    })


	//**USERLIST** Displays our users information in the admin User Page.
 	app.post('/api/userlist', function (req, res) {
		User.find({},{password: 0}, function (err, docs) {
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

	//**driverlist** Displays our driver information in the admin Driver Page.
 	app.post('/api/driverlist', function (req, res) {
		Driver.find({},{password: 0}, function (err, docs) {
			console.log(docs);
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

	app.post('/api/stafflist', function (req, res) {
		Staff.find({},{password: 0}, function (err, docs) {
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

	//Signs New drivers up to the platform to allow us to investigate and activate there account.
 	app.post("/api/signup", function(req, res){
		Driver.findOne({username: req.body.username}, function(err, driver){
			if(driver){
			 	return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
			   	var driver = new Driver();
				driver.username = req.body.username;
				driver.password = req.body.password;
				driver.email = req.body.email;
				driver.firstname = req.body.firstname;
				driver.lastname = req.body.lastname;
				driver.mobile = req.body.mobile;
				driver.day = req.body.day;
				driver.month = req.body.month;
				driver.year = req.body.year;
				driver.address = req.body.address;
				driver.city = req.body.city;
				driver.postcode = req.body.postcode;
				driver.vehicle = req.body.vehicle;
				driver.reg = req.body.reg;
				driver.porters = req.body.porters;
				driver.vehiclenumber = req.body.vehiclenumber;
				driver.bank = req.body.bank;
				driver.acc = req.body.acc;
				driver.sc = req.body.sc;
				driver.save(function(err, driver){
					return res.json({
						success: true,
					});
				});
			} //else close
		});
	});

	app.post("/api/addstaff", function(req, res){
		Staff.findOne({username: req.body.username}, function(err, staff){
			if(staff){
		 		return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
		   		var staff = new Staff();
				staff.username = req.body.username;
				staff.password = req.body.password;
				staff.email = req.body.email;
				staff.firstname = req.body.firstname;
				staff.lastname = req.body.lastname;
				staff.position = req.body.position;
				staff.save(function(err, staff){
				   	return res.json({
						success: true,
					});
				});
			} //else close
		});
	});


    /////  T DISPATCH  /////
	app.post('/api/tdispatch-book', function(req, res) {
        var jobInfo = req.body.data;
        // GET USERID FROM COOKIE
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            // GET ACCESS TOKEN FROM DB
            td.getAccessToken(userID, function(access) {
                // CALL TDISPTCH API TO BOOK
    			td.bookJob(jobInfo, access, function(data) {
                    // EXPIRED TOKEN GET NEW OnE  - (STRING MAY CHANGE ON TDIPATCH)
                    if(data.message == 'Expired access token.') {
                        // Get REFRESH TOKEN FROM DB
                        td.getRefreshToken(userID, function(currToken) {
                            // SEND TDISPATCH REFRESH TOKEN TO GET NEW ACCESS TOKEN
                            td.refreshCurrentToken(currToken, function(newAccessToken) {
                                // SAVE NEW ACCESS TOKEN INTO DB
                                td.saveNewAccessToken(userID, newAccessToken, function(status) {
                                    // IF SAVED TOKEN OK
                                    if(status == true) {
                                        td.bookJob(jobInfo, newAccessToken, function(data) {
                                            // Booked With NEw token
                                        })
                                    }
                                })
                            })
                        })
                    }

                    if(data.status == 'OK') {
                        // BOOKED!
                        console.log(data);
                        // SAVE BOOKING PK TO MONGO FOR GET BOOKING COST
                        var mongoData = {};
                        mongoData.col = Quote;
                        mongoData.fields = ["pk", "recieptUrl", "status"];
                        mongoData.newValues = [data.booking.pk, data.booking.receipt_url, data.booking.status];
                        mongoData.selector = 'userID';
                        mongoData.selectorVal = userID;

                        func.updateMongoFields(mongoData, function(status) {
                            // saved!
                            // ShoW CuSTOMER SOMTHing
                        })
                    }
    			})
    		})
        })

	})

    app.post('/api/tdispatch-calc', function(req, res) {
		td.getMainAccessToken(User, function(access) {
			td.calcFare(res, access, function(data) {
				res.json({
					success: true,
					message: 'calc complete',
					data: data
				});
			})
		})
	})


    app.post('/api/save-instant-job', function(req, res) {
		var quote = new Quote();

		// set the user's local credentials
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            quote.userID = userID;
    		quote.jobName = req.body.data.jobName;
    		quote.vanType = req.body.data.vanType;
    		quote.porterQty = req.body.data.porterQty;
    		quote.jobDate = req.body.data.jobDate;
    		quote.fuelPrice = req.body.data.fuelPrice;
    		quote.suggestedPrice = req.body.data.suggestedPrice;
    		quote.address = req.body.data.address;
    		quote.distance = req.body.data.distance;
    		quote.pk = req.body.data.pk;
    		quote.recieptUrl = req.body.data.recieptUrl;
    		quote.status = req.body.data.status;

    		// save the quote
    		quote.save(function(err) {
    			console.log(err);
    			if(err) {
    				return done(false);
    			} else {
    				res.json({
    					success: true,
    					message: 'Quote Saved'
    				});
    			}
    		});
        });
	})


	app.get('*', function(req, res) {
        res.render('pages/index');
    });



//THIS IS THE USER SIGN IN CONDITIONS///
	passport.use('local', new localStrategy(function(username, password, done){
	    User.findOne({username: username, password: password}, function(err, user){
	        if(user){return done(null, user);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });


//THIS IS THE STAFF SIGN IN CONDITIONS///

    passport.use('local-admin', new localStrategy(function(username, password, done){
	    Staff.findOne({username: username, password: password}, function(err, staff){
	        if(staff){return done(null, staff);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(staff, done) {
        done(null, staff);
    });
    passport.deserializeUser(function(staff, done) {
        done(null, staff);
    });


    // THIS IS THE Driver SIGN IN CONDITIONS//

    passport.use('local-driver', new localStrategy(function(username, password, done){
	    Driver.findOne({username: username, password: password}, function(err, driver){
	        if(driver){return done(null, driver);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(driver, done) {
        done(null, driver);
    });
    passport.deserializeUser(function(driver, done) {
        done(null, driver);
    });



}; // EXPORT








/*td.authCode = function(callback) {

	var options = {
		key: 'c5c13f4fe1aac89e417c879c0d8554ae',
		response_type: 'code',
		client_id: 'iesgbqOcGs@tdispatch.com',
		//redirect_uri: '',
		scope: '',
		//grant_type: 'user',
		response_format: 'json'
	};

	options = func.param(options);

	var url = 'http://api.tdispatch.com/passenger/oauth2/auth?'+options;
	var databody = {'username': 'test444@test.com', 'password': '123'};

	needle.post(url, databody, function(err, resp, body) {
		callback(body['auth_code']);
	});
}*/

/*td.getTokens = function(authCode, callback) {
	var options = {
		code: ''+authCode+'',
		client_id: 'iesgbqOcGs@tdispatch.com',
		client_secret: 'PeYQRXDWWFAa3WQR7UwHJRs2DZD5eKsP',
		//redirect_uri: '',
		grant_type: 'authorization_code',
		response_format: 'json'
	};

	options = func.param(options);

	var url = 'http://api.tdispatch.com/passenger/oauth2/token';

	needle.post(url, options, function(err, resp, body) {
		callback(body);
	});

*/
/*td.authCode(function(authCode) {
	if(authCode) {
		td.getTokens(authCode, function(tokens) {
			td.saveTokens(tokens, function() {

			})

		})
		res.json({
			success: true,
			message: 'Auth Code Success',
			data: authCode
		});
	}
});*/
