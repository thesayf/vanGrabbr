var jwt = require('jsonwebtoken');
var Token = require('../models/token');

var pp = {};

pp.jwtSecret = 'shhhhh';


pp.issueToken = function(user, done) {
    var token = jwt.sign(user, pp.jwtSecret);

    pp.saveRememberMeToken(token, user.id, function(err) {
        if(err) {return done(err);}
        done(null, token);
    });
    done(null, token);
}

pp.consumeRememberMeToken = function(uid, fn) {
    Token.remove({uid: uid}, function(err) {
        if (!err) {
            //console.log(err);
        } else {
            //console.log(err);
        }
    });
    return fn(null, uid);
}

pp.saveRememberMeToken = function(tokenNumber, uid, fn) {
    var token = new Token();
    token.token = tokenNumber;
    token.uid = uid;
    token.save(function(err) {
        if(err) {
            fn(err);
        }
    });
}

pp.getUserID = function(rememberCookie, callback) {
    var decoded = jwt.verify(rememberCookie, pp.jwtSecret);
    callback(decoded._doc._id);
}


pp.getToken = function(tokenNum, callback) {
    Token.findOne({'token': tokenNum}, function (err, tokenFound) {
        //var decoded = jwt.verify(tokenFound.token, pp.jwtSecret);
        //console.log(decoded);
        if(tokenFound) {
            callback(tokenFound.token);
        } else {
            callback(false);
        }
    });
}

pp.randomString = function(len) {
    var buf = [];
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

pp.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = pp;
