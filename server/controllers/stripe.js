var stripe = require("stripe")(
  "sk_test_L7l15Y9Hf3elbyUbjdcxlGiC"
);
var User = require(__dirname + '/../models/user');

var stripePay = {};

stripePay.chargeCustomer = function(price, customerID, source, callback) {
    stripe.charges.create({
        amount: price,
        currency: "GBP",
        source: source, // obtained with Stripe.js
        description: "Charge for "+customerID
    }, function(err, charge) {
        // asynchronously called
    });
}

stripePay.createCustomer = function(userData, callback) {
    //console.log(callback);
    stripe.customers.create({
        description: 'Customer for '+userData.email,
        email: userData.email,
        metadata: {
            'systemID': ''+userData.id+'',
            'pk': ''+userData.pk+'',
        },
        source: userData.tokenID
    }, function(err, customer) {
        if(err) {
            callback(err);
        } else {
            callback(customer);
        }
    });
}

stripePay.saveCardData = function(cardData, userID, callback) {
    User.findOne({_id: userID}, function(err, doc) {
        doc.cardID = cardData.id;
        doc.cardAdded = 'added';
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    })
}

stripePay.saveCustomerData = function(stripeData, callback) {
    User.findOne({ _id: stripeData.metadata.systemID }, function (err, doc){
        //console.log(doc);
        //console.log(data);
        doc.stripeID = stripeData.id;
        doc.cardAdded = true;
        doc.cardID = stripeData.sources.data[0]['id'];
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        });
        if(err) {
            callback(err);
        } else {
            callback(true);
        }
    });
    //
}

stripePay.getCustomer = function(stripeID, callback) {
    stripe.customers.retrieve(
        stripeID,
    function(err, customer) {
        callback(customer);
    });
}

stripePay.addCard = function(stripeID, token, callback) {
    stripe.customers.createSource(
        stripeID,
        {source: token},
    function(err, card) {
        if(err) {
            callback(err)
        } else {
            callback(card)
        }
    });
}

stripePay.getCard = function(stripeID, cardID, callback) {
    stripe.customers.retrieveCard(
        stripeID, cardID,
    function(err, card) {
        console.log(err);
        console.log(card);
        callback(card);
    });
}

stripePay.deleteCard = function(stripeID, cardID, callback) {
    stripe.customers.deleteCard(stripeID, cardID, function(err, confirmation) {
        if(err) {
            callback(err);
        } else {
            callback(confirmation);
        }
    });
}




module.exports = stripePay;
