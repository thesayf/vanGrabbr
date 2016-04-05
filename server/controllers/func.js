var User = require(__dirname + '/../models/user');

var func = {};

func.getUserFields = function(userID, fields, callback) {
    User.findOne({'_id': userID}, fields, function (err, doc) {
        console.log(doc);
        console.log(err);
        callback(doc);
    });
}

func.updateUserField = function(userID, field, newValue, callback) {
    User.findOne({'_id': userID}, function (err, doc) {
        doc.cardAdded = newValue;
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    });
}



// fields = [0: "stripeID", 1:"cardID"];
// newValues = [0: "red", 1:"blue"];
func.updateUserFields = function(userID, fields, newValues, callback) {
    User.findOne({'_id': userID}, function(err, doc) {
        fields.forEach(function(v, k) {
            doc[v] = newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    })
}


func.updateMongoFields = function(mongoData, callback) {
    var fieldSelector = mongoData.selector;
    mongoData.col.findOne({fieldSelector: mongoData.selectorVal}, function(err, doc) {
        mongoData.fields.forEach(function(v, k) {
            doc[v] = mongoData.newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                if(mongoData.pullBack) {
                    callback(doc);
                } else {
                    callback(true);
                }
            }
        })
    })
}

func.getMongoFields = function(col, userID, fields, newValues, callback) {
    col.findOne({'userID': userID}, function(err, doc) {
        fields.forEach(function(v, k) {
            doc[v] = newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    })
}

func.param = function(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}


module.exports = func;
