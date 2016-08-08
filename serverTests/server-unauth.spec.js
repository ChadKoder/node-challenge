var supertest = require('supertest');
	var api = supertest('http://localhost:8888');
	
var logout = function (done) {
		 api.post('/logout').expect(204, done);
};
	
describe('server unauthorized', function() {
	beforeEach(function(done){ 
		//logout to ensure unauthorized..
		logout(done);
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
		
		it('/invalidUrl should return status code 401 Unauthorized', function(done){
			 api.get('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
	});
	
	describe('http DELETE', function(){
		it('/configs should return status code 401 Unauthorized', function(done){
			api.delete('/configs')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
		
		it('/invalidUrl should return status code 404 Unauthorized', function(done){
			 api.delete('/invalidUrl')
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
	
		it('/logout should return status code 204 No Content', function(done){
			 api.post('/logout')
				.set('Accept', 'application/json')
				.expect(204, done);
		});
		
		it('then POST /invalidUrl should return status code 404 Not Found', function(done){
			 api.post('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
	
	describe('http PUT', function(){
		it('/configs should return 401 Unauthorized', function(done){
			var newConfig = '{"config":{"username":"d","name":"g","hostname":"r","port":"c"}}';
			api.post('/configs')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(newConfig)
				.expect(401, done);
		});
		
		it('/invalidUrl should return status code 401 Unauthorized', function(done){
			 api.put('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
	});
});