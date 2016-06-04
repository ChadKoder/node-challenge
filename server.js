var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	token = '';
	//validateUser = require('./validateUser');

const PORT = 8888;

var validate = function (userName, password){
	var users = [
		{ username: 'ChadK', password: 'Tenable'},
		{ username: 'Admin', password: '123xyzABC!@'}];
		 
	for (var i = 0; i <= users.length - 1; i++){
		if (userName === users[i].username && password === users[i].password){
			return true;
		}
		
		return false;
	}   
};

http.createServer(function (req, res) {
	var currentWorkingDir = process.cwd(),
	uri = url.parse(req.url).pathname,
	fileName = path.join(currentWorkingDir, uri);
		
		if (uri.indexOf('/main') > -1){
			fs.readFile('main.html', 'binary', function( err, file){
				if (err) {
				console.log('error!!!');
					res.writeHead(500, {'Content-Type': 'text/html'});
					res.write(err + '\n');
					res.end();
					return;
				}
				
			res.writeHeader(200, {'Content-Type': 'text/html'},
						{'Authorization': 'Basic ' + token});
			res.write(file, 'binary');
			res.end();
			return;
		});
		
		return;
		}
		
		if (uri.indexOf('/attemptLogin') > -1){
				var credentials = url.parse(req.url, true).query;
				
				if (credentials){
					var username = credentials.username;
					var password = credentials.password;
					
					if (!validate(username, password)){
						res.writeHead(401);
						res.write('401 Unauthorized');
						res.end();
						return;
					} else {
						token = new Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
						
						res.writeHeader(200, {'Content-Type': 'text/html'},
										{'Authorization': 'Basic ' + token});
						res.write('200 OK');
						res.end();
						
						return;
					}
				}
				
				return;
		}
		
		if (fs.statSync(fileName).isDirectory()) {
			fileName += 'index.html'; 
		}
		
		fs.readFile(fileName, 'binary', function( err, file){
				if (err) {					
				console.log('error!!!');
					res.writeHead(500, {'Content-Type': 'text/html'});
					res.write(err + '\n');
					res.end();
					return;
				}
				
				//console.log('hosting: ' + fileName);
				//res.writeHeader(200, {'Content-Type': 'text/html'});
				//res.write(file, 'binary');
				//res.end();
			
			res.writeHead(200);
			res.write(file, 'binary');
			res.end();
		});
}).listen(parseInt(PORT, 10)); 

console.log('Server running at --> http://localhost:' + PORT + '/\nCTRL+C to shutdown');