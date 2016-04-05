var rest 		= require('restler');
var Token       = require(__dirname + '/../models/token');
var User        = require(__dirname + '/../models/user');

var td = {};

td.clientId = 'iesgbqOcGs@tdispatch.com';
td.clientSecret = 'PeYQRXDWWFAa3WQR7UwHJRs2DZD5eKsP';
td.key = 'c5c13f4fe1aac89e417c879c0d8554ae';
td.mainUserID = '56c8ae3694700b740868d58a';

td.authUrl = 'http://api.tdispatch.com/passenger/oauth2/auth';
td.tokenUrl = 'http://api.tdispatch.com/passenger/oauth2/token';
td.calcFareUrl = 'http://api.tdispatch.com/passenger/v1/locations/fare';
td.bookJobUrl = 'http://api.tdispatch.com/passenger/v1/bookings';
td.createAccountUrl = 'http://api.tdispatch.com/passenger/v1/accounts';

// GET ALREADY SAVED ACCESS TOKEN
td.getAccessToken = function(userID, callback) {
	User.findOne({_id: userID}, function(err, docs) {
        //console.log(docs['pk']);
		callback(docs['accessToken']);
	})
}

td.getMainAccessToken = function(User, callback) {
	User.findOne({_id: td.mainUserID}, function(err, docs) {
		callback(docs['accessToken']);
	})
}

td.getRefreshToken = function(userID, callback) {
	User.findOne({_id: userID}, function(err, docs) {
		callback(docs['refreshToken']);
	})
}

td.refreshCurrentToken = function(currToken, callback) {
	var data = {
		refresh_token: currToken,
		client_id: td.clientId,
		client_secret: td.clientSecret,
		grant_type: "refresh_token"
	};
	var url = td.tokenUrl;

	rest.postJson(url, data).on('complete', function(data, resp) {
		callback(data.access_token);
	});
}

td.saveNewAccessToken = function(userID, newAccessToken, callback) {
	User.findOne({ _id: userID}, function (err, doc){
        doc.accessToken = newAccessToken;
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        });
    });
}


td.saveTokens = function(tokens, callback) {
	var token = new Token();
	token.access = tokens['access_token'];
	token.refresh = tokens['refresh_token'];
	token.save(function(err) {
		if(err) {
			callback(false);
		} else {
			callback(true);
		}
	});
}

td.createAccount = function(user, callback) {
    var info = {
        'first_name': user.firstname,
        'last_name': user.lastname,
        "email": user.email,
        "phone": user.mobile,
        "password": user.password,
        "client_id": td.clientId
    };
    var url = td.createAccountUrl+'?key='+td.key;
	rest.postJson(url, info).on('complete', function(data, resp) {
          callback(data);
     });
}

td.getFinalCost = function(bookingID, access, callback) {
	var url = td.bookJobUrl+'/'+bookingID+'?access_token='+access;
	rest.get(url).on('complete', function(data) {
  		callback(data);
	});
}

td.calcFare = function(data, access, callback) {
	var info = data.req.body.data;
	var jsonFare = {
	    "pickup_location": {
	        "lat": info.address.start_location.lat,
	        "lng": info.address.start_location.lng
	    },
	    "dropoff_location": {
	        "lat": info.address.end_location.lat,
	        "lng": info.address.end_location.lng
	    },
	    /*"way_points": [
	        {
	            "lat": 52.393385,
	            "lng": 13.036222
	        }
	    ],*/
	    "pickup_time": info.jobDate,
	    "payment_method": info.payment_method,
	    //"voucher": "FREECODE",
	    //"minutes_waited": 5,
	    //"allocated_hours": 3.5,
	    "car_type": "51fbd9d36e77c304c0fc4fea",
	    "passengers": 1,
	    "luggage": 1
	    /*"extras": [
	        "5154a1256e77c322e4973765",
	        "51b682aa6e77c375af324bcd"
	    ]*/
	}

	console.log(jsonFare);

	var url = td.calcFareUrl+'?access_token='+access;

	rest.postJson(url, jsonFare).on('complete', function(data, resp) {
		callback(data);
	});

}

td.bookJob = function(jobInfo, access, callback) {
	//console.log(jobInfo);
	var data = {
		/*"passenger":
			{"name": "Pablo Escobar", "phone": "+49123470416", "email": "esco@tdispatch.com"},*/
		 "pickup_time": jobInfo.jobDate,
		 //"return_time": "2016-05-09T10:30:00-02:00",
		 "pickup_location": {
			//"postcode": "cr77jg",
			 "location": {"lat": jobInfo.address.start_location.lat, "lng": jobInfo.address.start_location.lng},
			 "address": jobInfo.address.start_location.name
		 },
		 /*"way_points": [
			 {"postcode": "13355", "location": {"lat": 52.542381, "lng": 13.392463}, "address": "Voltastra\u00dfe 100"}
		 ],*/
		 "dropoff_location": {
			 //"postcode": "e33rd",
			 "location": {"lat": jobInfo.address.end_location.lat, "lng": jobInfo.address.end_location.lng},
			 "address": jobInfo.address.end_location.name
		 },
		 //"luggage": 5,
		 //"passengers": 3,
		 "extra_instructions": jobInfo.driverNote,
		 "payment_method": "cash",
		 "pre_paid": false,
		 "status": "incoming",
		 "vehicle_type": jobInfo.vanType,
		 //"extras": ["510031e06e77c31c03000d1b", "5089aa156e77c311fc000bf1"]
		 //"voucher": "ABCD1234",
 	};

	var url = td.bookJobUrl+'?access_token='+access;

	rest.postJson(url, data).on('complete', function(data, resp) {
		//console.log(data);
		//console.log(resp);
		callback(data);
	});
}

// POST REQUEST = SENding DATA THROUGH THE BODY (DATA HIDDEN FROM vieW)
// GET REQUEST = SENDING DATA THROUGH URLS (http://google.com/?search=midgets)

// BringS BACK 1st REquiRED TDISPATCH AUTH CODE (NEEDED TO MAKE API CALLS)
td.authCode = function(callback) {
	var options = {
		key: td.key,
		response_type: 'code',
		client_id: td.clientId,
		//redirect_uri: '',
		scope: '',
		//grant_type: 'user',
		response_format: 'json'
	};
	options = func.param(options);
	// http://api.tdispatch.com/passenger/oauth2/auth?key=hcjdkhjdhjlh&response_type=code&....
	var url = td.authUrl+'?'+options;
	var databody = {'username': 'test444@test.com', 'password': '123'};
    rest.postJson(url, databody).on('complete', function(data, resp) {
        console.log(resp);
        console.log(data);
	});
}

td.getTokens = function(authCode, callback) {
	var options = {
		code: ''+authCode+'',
		client_id: td.clientId,
		client_secret: td.clientSecret,
		//redirect_uri: '',
		grant_type: 'authorization_code',
		response_format: 'json'
	};
	options = func.param(options);
	var url = td.tokenUrl;
	needle.post(url, options, function(err, resp, body) {
		callback(body);
	});
}

td.refreshToken = function(refreshToken) {
    var options = {
        refresh_token: refreshToken,
        client_id: td.clientId,
        client_secret: td.clientSecret,
        grant_type: 'refresh_token',
    };
    options = func.param(options);

    var url = td.tokenUrl+'?'+options;
    console.log(url);
    var databody = {'username': 'test444@test.com', 'password': '123'};

    rest.postJson(url, databody).on('complete', function(data, resp) {
		console.log(data);
	});

}

td.saveAccountDetails = function(User, data, user, callback) {
    User.findOne({ _id: user._id }, function (err, doc){
        console.log(doc);
        console.log(data);
        doc.pk = data['passenger']['pk'];
        doc.refreshToken = data['passenger']['refresh_token'];
        doc.accessToken = data['passenger']['access_token'];
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        });
    });
}

module.exports = td;
