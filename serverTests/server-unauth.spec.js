var supertest = require('supertest');
var api = supertest('http://localhost:8888');
var http = require('http');

describe('server', function() {

	beforeEach(function(){
		var options = {
			  hostname: 'http://localhost:8888',
			  port: 8888,
			  path: '/logout',
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  }
		};
		
		//logout for tests to ensure unauthorized..
		var req = http.request(options, function (res) {
		});
		
		req.write('');
		req.end();
	});
	
	describe('http GET', function(){
		it ('/validateUser should return status code 401 Unauthorized', function(done){
			 api.get('/validateUser')
			.set('Accept', 'application/json')
			.expect(401, done);
		});

		it('/user-configruations should return status code 401 Unauthorized', function(done){
			 api.get('/user-configurations')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
			
		it('/configs should return status code 401 Unauthorized', function(done){
			 api.get('/configs')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
				
		it('/ should return status code 200 OK', function(done){
			 api.get('/')
				.set('Accept', 'application/json')
				.expect(200, done);
		});
		
		it('/invalidUrl should return status code 404 Not Found', function(done){
			 api.get('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
	
	describe('http DELETE', function(){
		it('/configs should return status code 200 OK', function(done){
		 api.delete('/configs')
			.set('Accept', 'application/json')
			.expect(401, done);
		});
	});
	
	describe('http POST', function(){
		it('/configs should return status code 401 Unauthorized', function(done){
		 api.post('/configs')
			.set('Accept', 'application/json')
			.expect(401, done);
		});
	
		it('/logout should return status code 200 OK', function(done){
			 api.post('/logout')
				.set('Accept', 'application/json')
				.expect(204, done);
		});
		
		it('/logout should return status code 200 OK', function(done){
			 api.post('/logout')
				.set('Accept', 'application/json')
				.expect(204, done);
		});
	});
});