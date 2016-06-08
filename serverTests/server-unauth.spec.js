var supertest = require('supertest');
var api = supertest('http://localhost:8888');
var http = require('http');

describe('server', function() {
	describe('Unauthorized request', function(){
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
			var req = http.request(options, (res) => {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS:  ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', (chunk) => {
				console.log('BODY: ' + chunk);
			  });
			  res.on('end', () => {
				console.log('No more data in response.')
			  });
			});
			
			req.write('');
			req.end();
		});
		it('GET /validateUser should return status code 401 Unauthorized', function(done){
			 api.get('/validateUser')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
		
		it('GET /user-configruations should return status code 401 Unauthorized', function(done){
			 api.get('/user-configurations')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
		 
		
		it('GET /configs should return status code 401 Unauthorized', function(done){
			 api.get('/configs')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
				
		it('GET / should return status code 200 OK', function(done){
			 api.get('/')
				.set('Accept', 'application/json')
				.expect(200, done);
		});
	
		it('DELETE /configs should return status code 200 OK', function(done){
			 api.delete('/configs')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
		
		it('should return status code 401 Unauthorized', function(done){
			 api.post('/configs')
				.set('Accept', 'application/json')
				.expect(401, done);
		});
		
		it('should return status code 200 OK', function(done){
			 api.post('/logout')
				.set('Accept', 'application/json')
				.expect(204, done);
		});
	});
});