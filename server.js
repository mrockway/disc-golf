//  set variables and requires
var express = require('express'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	request = require('request'),
	dotenv = require('dotenv').load(),
	app = express();

// set express view engine
app.set('view engine', 'hbs');

//enable body-parser to gather data
app.use(bodyParser.urlencoded({extended: true}));

//  set up mongoDB
mongoose.connect('mongodb://localhost/disc_golf_app');

// set express to look in public folder for css and js
app.use(express.static(__dirname + '/public'));

// GET route for homepage
app.get('/', function( req,res) {
	res.render('index');
});

//  GET route for courses
app.get('/courses', function(req, res) {
	var newUrl = {
		url:'https://api.pdga.com/services/json/course?postal_code=95677',
		headers: {
			'Cookie':process.env.pdgaCookie
		}
	};
	request(newUrl).pipe(res);
});

//  GET route for events
app.get('/events', function(req, res) {
	var newUrl = {
		url:'https://api.pdga.com/services/json/event?start_date=12/01/2015&end_date=02/01/2016',
		headers: {
			'Cookie':process.env.pdgaCookie
		}
	};
	request(newUrl).pipe(res);
});

//  server location
app.listen(process.env.PORT || 3000, function() {
	console.log('server is working');
});