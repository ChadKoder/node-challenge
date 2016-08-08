var supertest = require('supertest');
var api = supertest('http://localhost:8888');
var login = function (done) {
		 api.get('/validateUser')
				.set('Authorization', 'Basic Y2hhZGs6VGVuYWJsZQ==')
				.expect(200, done);
	};
	
beforeEach(function(done){
	login(done);
});

describe('server authorized', function() {
	describe('http GET', function(){
		it('/validateUser should return status code 200 OK', function(done){
			 api.get('/validateUser')
				.set('Authorization', 'Basic Y2hhZGs6VGVuYWJsZQ==')
				.expect(200, done);
		});
		
		it('/user-configruations should return status code 200 OK', function(done){
			 api.get('/user-configurations')
				.set('Accept', 'text/html')
				.expect(200, done);
		});
		
		it('/configs should return status code 200 OK', function(done){
			 api.get('/configs')
				.set('Accept', 'application/json')
				.expect(200, done);
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
		it('/configs should return status code 204 No Content', function(done){
			 api.delete('/configs?id=brad')
				.set('Accept', 'application/json')
				.expect(204, done);
		});
		
		it('then DELETE /invalidUrl should return status code 404 Not Found', function(done){
			 api.delete('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(404, done);
		});	
	});
	
	describe('http POST', function(){
		it('should return status code 204 No Content', function(done){
			var newConfig = '{"config":{"username":"newusername","name":"newname","hostname":"newhost","port":"9876"}}';
			api.post('/configs')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(newConfig)
				.expect(204, done);
		});
		
		it('then POST /invalidUrl should return status code 404 Not Found', function(done){
			 api.post('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
		
	});
	
	describe('http PUT', function(){
		it('/configs should return status code 204 No Content', function(done){
			var updatedConfig = '{"config":{"username":"admin","name":"john","hostname":"updatedhost","port":"4713"}}';
			
		 api.put('/configs')
			.set('Acceptconfigs', 'application/json')
			.send(updatedConfig)
			.expect(204, done);
		});
		it('/invalidUrl should return status code 404 Not Found', function(done){
			 api.put('/invalidUrl')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
		
	});
	
 
});