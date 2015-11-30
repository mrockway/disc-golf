//  set variables and requires
var express = require('express'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	request = require('request'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	//oauth = require('./oauth.js'),
	dotenv = require('dotenv').load(),
	app = express();

// var to save user location
//var zipCode;

//Require models
var User = require('./models/user');

// set express view engine
app.set('view engine', 'hbs');

//enable body-parser to gather data
app.use(bodyParser.urlencoded({
	extended: true
}));

//  set up mongoDB
mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/disc_golf_app');

// set express to look in public folder for css and js
app.use(express.static(__dirname + '/public'));

// use partials
hbs.registerPartials(__dirname + '/views/partials');

// tell express to use passport
app.use(cookieParser());

// tell express to use session
app.use(session({
	secret: 'disc_golf_key',
	resave: false,
	saveUninitialized: false
}));

// tell express to save user sessions
app.use(passport.initialize());
app.use(passport.session());

// setup authenticate for user login
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GET route for homepage
app.get('/', function(req, res) {
	res.render('index');
});

// GET route for profile
app.get('/profile/:zipCode', function(req, res) {
	console.log('redirect');
	res.render('profile');
	console.log('after redirect');
});

//  GET route for courses
app.get('/courses', function(req, res) {
	var zipCode = req.query.postal_code;
	console.log('get from form',zipCode);
	res.redirect('/profile/'+ zipCode);
});

app.get('/courseSearch/:zipCode', function(req, res) {
	zipCode = req.params.zipCode;
	console.log('zipcode in get', zipCode);
	var newUrl = {
		url: 'https://api.pdga.com/services/json/course?postal_code=' + zipCode,
		type: "GET",
		headers: {
			'Cookie': process.env.pdgaCookie
		}


	};
	request(newUrl).pipe(res);
	//res.redirect('/profile');
});

//  GET route for events
app.get('/events', function(req, res) {
	var newUrl = {
		url: 'https://api.pdga.com/services/json/event?start_date=12/01/2015&end_date=02/01/2016',
		headers: {
			'Cookie': process.env.pdgaCookie
		}
	};
	request(newUrl).pipe(res);
});

// GET route for login
app.get('/login', function(req, res) {
	res.render('login');
});

// Authenticate user
app.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/profile');
});

// GET route for signup
app.get('/signup', function(req, res) {
	res.render('signup');
});

// POST route for signup
app.post('/signup', function(req, res) {
	User.register(new User({
			username: req.body.username
		}), req.body.password,
		function(err, newUser) {
			passport.authenticate('local')(req, res, function() {
				res.redirect('/profile');
			});
		}
	);
});

//GET route to logout
app.get('/logout', function(req,res) {
	req.logout();
	res.redirect('/');
});

//  server location
app.listen(process.env.PORT || 3000, function() {
	console.log('server is working');
});