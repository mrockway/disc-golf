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
	flash = require('express-flash'),
	zipCodeNpm = require("zipcode"),
	dotenv = require('dotenv').load(),
	app = express();


//Require models
var User = require('./models/user');
var Course = require('./models/course');
var Session = require('./models/session');

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

// send flash messages for errors
app.use(flash());

// setup authenticate for user login
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// sessionId to send with api calls to pdga
// function to get session id from db
var sessionId;

function findSessionID() {
	var sessionData = Session.find({}, function(err, data) {
			sessionId = data[0].pdgaSessionID;
		});	
}


//get year for copyright footer
var currentYear = new Date();
currentYear = currentYear.getFullYear();

// GET route for homepage
app.get('/', function(req, res) {
	findSessionID();
	res.render('index', {user : req.user , currentYear: currentYear});
});

//
app.get("/checkzipcode", function (req, res) {
	if (zipCodeNpm.lookup(req.query.zipCode)) {
		res.render('profile');
	}
	else {
		res.send("invalid zipcode");
	}
});

//GET route for profile
app.get('/profile', function(req, res) {
		res.render('profile', {user : req.user , currentYear: currentYear});
});

// GET route for courses
app.get('/courses', function(req, res) {
	//get session id from db,  findOne...
	var zipCode = req.query.zip;
	var newUrl = {
		url: 'https://api.pdga.com/services/json/course?postal_code=' + zipCode,
		type: "GET",
		headers: {
			'Cookie': process.env.pdgaCookie + sessionId 
		}
	};
	request(newUrl, function(err, courseRes, courseBody) {
		if (courseRes.statusCode === 403 ) {
			pdgaLogin();
			//console.log('courseRes',courseRes);
		} else {
			var courseList = JSON.parse(courseBody);
			res.json(courseList);
		}
	});
});


//  GET route for events
app.get('/events', function(req, res) {
	//get session id from db, findone...
	var newUrl = {
		url: 'https://api.pdga.com/services/json/event?state=' + req.query.state,
		headers: {
			'Cookie': process.env.pdgaCookie + sessionId
		}
	};
	request(newUrl, function(err, eventRes, eventBody) {
		var eventList = JSON.parse(eventBody);
		//if error 403 call login API, save sessionid to db, then do the courses call again
		res.json(eventList);
	});
});

// GET route for login
app.get('/login', function(req, res) {
		if (req.user) {
			res.redirect('/');
		} else {
			res.render('login', { user : req.user, currentYear: currentYear, errorMessage: req.flash('error')});	
		}
});

// Authenticate user
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
	})
);

// GET route for signup
app.get('/signup', function(req, res) {
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('signup', { user : req.user, currentYear: currentYear, errorMessage: req.flash('signupError')});
	}
});

// POST route for signup
app.post('/signup', function(req, res) {
	if (req.user) {
		res.redirect('/');
	} else {
		User.register(new User({ username: req.body.username}), req.body.password,
		function(err, newUser) {
			if (err) {
				req.flash('signupError', err.message);
				res.redirect('/signup');
			} else {	
				passport.authenticate('local')(req, res, function() {
					res.redirect('/');
				});
			}
		}
		);
	}
});

//GET route to logout
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Login function for PDGA API session
function pdgaLogin(){
	var pdgaLoginCall = {
		url: 'https://api.pdga.com/services/json/user/login',
		headers: { 'Content-type': 'application/json' },
		json: { 'username':'mrockway','password':process.env.pdgaPassword },
	};
	request.post(pdgaLoginCall, function(err, loginRes, loginBody) {
		console.log('loginBody',loginBody.sessid);
		Session.remove().exec();
		var session =  Session.create(
			{ pdgaSessionID: loginBody.sessid,
				sessionName: 'loginSession' },
			function(err, success){
				if (err) {
				console.log('err',err);
			} else {
				console.log(success);
			}
			});
	});
}

//  server location
app.listen(process.env.PORT || 3000, function() {
	console.log('server is working');
});

// Expected Response from PDGA Login
// {
//     "sessid": "5_SzWjfsgaN5iPC9ex9ghsy_qGjWhXxl_ogsokECQb0",
//     "session_name": "SSESSf1f85588bb869a1781d21eec9fef1bff",
//     "token": "rkh82YbrnPbkWxq-1eqItuzvjYqWUTzl3NjpWdEoRrw",
//     "user": {
//         "uid": "287596",
//         "name": "mrockway",
//         "mail": "mrockway@gmail.com",
//         "theme": "",
//         "signature": "",
//         "signature_format": "plain_text",
//         "created": "1448386940",
//         "access": "1455008832",
//         "login": 1455142797,
//         "status": "1",
//         "timezone": null,
//         "language": "",
//         "picture": null,
//         "data": {
//             "geoip_location_original": {
//                 "country": "United States",
//                 "country_code": "US",
//                 "city": "El Cerrito",
//                 "zip": "94530",
//                 "region_code": "CA",
//                 "region": "California",
//                 "latitude": 37.918,
//                 "longitude": -122.3032,
//                 "time_zone": "",
//                 "ip_address": "38.140.30.202",
//                 "timestamp": 1448386940
//             },
//             "ckeditor_default": "t",
//             "ckeditor_show_toggle": "t",
//             "ckeditor_width": "100%",
//             "ckeditor_lang": "en",
//             "ckeditor_auto_lang": "t",
//             "htmlmail_plaintext": 0
//         },
//         "uuid": "61feb581-ca91-49b6-b179-f0e0fc03e060",
//         "roles": {
//             "2": "authenticated user",
//             "8": "authorized developer"
//         },
//         "field_member_reference": [],
//         "rdf_mapping": {
//             "rdftype": [
//                 "sioc:UserAccount"
//             ],
//             "name": {
//                 "predicates": [
//                     "foaf:name"
//                 ]
//             },
//             "homepage": {
//                 "predicates": [
//                     "foaf:page"
//                 ],
//                 "type": "rel"
//             }
//         },
//         "comment_notify_settings": {
//             "uid": "287596",
//             "node_notify": "1",
//             "comment_notify": "1"
//         },
//         "twitter_accounts": []
//     }
// }