var supertest = require('supertest');
var server = require('../server');
var api = supertest('http://localhost:8888');

describe('server', function() {
	describe('test1', function() {
		it('should do something', function() {
			expect(1).toEqual(1);
		});
	});
	
	describe('GET /attemptLogin with no credentials', function(){
		it('should return status code 401 Unauthorized', function(done){
			 api.get('/attemptLogin')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
	});
});