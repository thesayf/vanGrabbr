// grab the mongoose module
var mongoose = require('mongoose');


// define the schema for our user model
var customItemSchema = mongoose.Schema({

	itemsid: Number,
    item: String,
    cubicFeet: Number,
    height: Number,
    width: Number,
    depth: Number,
    weight: Number,
    dismantle: Boolean,
    dismantleTime: Number,
    assembly: Boolean,
    assemblyTime: Number,
    protection: Boolean,
    protectionTime: Number,
    materialsUsed: String,
    materialsQuantity: Number,
    location: String,

});

// create the model for users and expose it to our app
module.exports = mongoose.model('CustomItem', customItemSchema);


/*var itemSchema = {
	itemsid: Number,
    item: String,
    cubicFeet: Number,
    height: Number,
    width: Number,
    length: Number,
    weight: Number,
    dismantle: Boolean,
    dismantleTime: Number,
    assembly: Boolean,
    assemblyTime: Number,
    protection: Boolean,
    protectionTime: Number,
    materialsUsed: String,
    materialsQuantity: Number,
    location: String,
}*/
