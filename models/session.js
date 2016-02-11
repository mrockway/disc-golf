//Create Schema for storing the session ID
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
		
var SessionSchema = new Schema({
	name: {type: String, default: "sessionName"},
	pdgaSessionID: String
});

var Session = mongoose.model('Session', SessionSchema);
module.exports = Session;