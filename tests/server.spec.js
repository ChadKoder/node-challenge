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
	});
	
});