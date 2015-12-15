//Create Schema for storing the session ID
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
		
var SessionSchema = new Schema({
	pdgaSessionID: String
});