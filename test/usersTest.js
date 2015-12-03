var request = require('request'),
		expect = require('chai').expect;

		describe('Users', function() {
			it('show sign up page on GET /signup route', function(done){
				request('http://localhost:3000/signup', function(err, res, body) {
					expect(res.statusCode).to.equal(200);
					done();
				});
			});
		});