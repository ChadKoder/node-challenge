var supertest = require('supertest');
var server = require('../server');
var api = supertest('http://localhost:8888');

describe('server', function() {
	describe('Unauthorized request', function(){
		describe('GET /validateUser with no credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/validateUser')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET /user-configurations with no credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/user-configurations')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET /configs with no credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET / with no credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.get('/')
					.set('Accept', 'application/json')
					.expect(200, done);
			});
		});
		
		describe('DELETE /configs with no credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.delete('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('POST /configs with no credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.post('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('POST /logout with no credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.post('/logout')
					.set('Accept', 'application/json')
					.expect(204, done);
			});
		});
	});
	
	describe('Authorized request', function(){
		var httpHandlerService;
		beforeEach(function(){
			 httpHandlerService = require('../src/httpHandlerService');
			httpHandlerService.setToken('a');
		});
		describe('GET /validateUser with credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/validateUser')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET /user-configurations with credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/user-configurations')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET /configs with credentials', function(){
			it('should return status code 401 Unauthorized', function(done){
				 api.get('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('GET / with credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.get('/')
					.set('Accept', 'application/json')
					.expect(200, done);
			});
		});
		
		describe('DELETE /configs with credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.delete('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('POST /configs with credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.post('/configs')
					.set('Accept', 'application/json')
					.expect(401, done);
			});
		});
		
		describe('POST /logout with credentials', function(){
			it('should return status code 200 OK', function(done){
				 api.post('/logout')
					.set('Accept', 'application/json')
					.expect(204, done);
			});
		});
	});
});