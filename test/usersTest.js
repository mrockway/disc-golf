var request = require('request'),
		expect = require('chai').expect;

		describe('Users', function() {
			it('show sign up page on GET /signup route', function(done){
				request('http://localhost:3000/signup', function(err, res, body) {
					expect(res.statusCode).to.equal(200);
					done();
				});
			});

			it('show login page on GET /login route', function(done){
				request('http://localhost:3000/login', function(err,res,body) {
					expect(res.statusCode).to.equal(200);
					done();
				});
			});

			it('show profile page on GET /profile route', function(done){
				request('http://localhost:3000/profile', function(err,res,body) {
					expect(res.statusCode).to.equal(200);
					done();
				});
			});

			it('show index page on GET / route', function(done){
				request('http://localhost:3000', function(err,res,body) {
					expect(res.statusCode).to.equal(200);
					done();
				});
			});

		});