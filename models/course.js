var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');


var CourseSchema = new Schema({
	course_id: String,  //referenced from PDGA API course_id? 
	course_name: String,
	course_description: String,
	street: String,
	city: String,
	state_province: String,
	postal_code: String,
	fees: String,
	holes: String,
	private: String,
	external_link_1_url: String
});

CourseSchema.plugin(passportLocalMongoose);

var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;