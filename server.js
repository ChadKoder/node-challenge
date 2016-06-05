var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	token = '',
	childProcess = require('child_process'),
	browserToLaunch = '',
	chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	iexplore = 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe';

var selectedBrowser = process.argv[2].toLowerCase();

if (selectedBrowser){
	if (selectedBrowser === 'chrome'){
		try {
			fs.statSync(chrome);
			browserToLaunch = chrome;
		} catch(e) {
			console.log('chrome does not exist, setting to launch with iexplore');
			browserToLaunch = iexplore;
		}
	} else if (selectedBrowser === 'iexplore'){
		try {
			fs.statSync(iexplore);
			browserToLaunch = iexplore;
		} catch(e) {
			console.log('iexplore does not exist, please manually launch your browser and navigate to "http://localhost:8888"');
			browserToLaunch = '';
		}
	} else {
		console.log('defined browser does not exist, please manually launch your browser and navigate to "http://localhost:8888"');
	}
}
	
const PORT = 8888;
//childProcess.spawn('C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe', ['http://localhost:8888']);
console.log('attempting to open ' + selectedBrowser);
childProcess.spawn(browserToLaunch, ['http://localhost:8888']);

var validate = function (userName, password){
	var users = [
		{ username: 'ChadK', password: 'Tenable'},
		{ username: 'Admin', password: '123xyzABC!@'},
		{ username: 'user', password: 'pass'}];
		 
	for (var i = 0; i <= users.length - 1; i++){
		if (userName === users[i].username && password === users[i].password){
			return true;
		}
		
		return false;
	}   
};

var urlContains = function(url, str){
	return url.indexOf(str) != -1;
};

http.createServer(function (req, res) {
	var contentType, currentWorkingDir = process.cwd(),
	uri = url.parse(req.url).pathname,
	fileName = path.join(currentWorkingDir, uri);
	
	if (urlContains(req.url, '.html')){
		contentType = 'text/html';
	} else if (urlContains(req.url, '.css')){
		contentType = 'text/css';
	} else if (urlContains(req.url, '.js')) {
		contentType = 'text/javascript';
	} else {
		contentType = 'text/html';
	}
		
	if (uri.indexOf('/main') > -1){
		fs.readFile('main.html', 'binary', function( err, file){
			if (err) {
				res.writeHead(500, {'Content-Type': contentType});
				res.write(err + '\n');
				res.end();
				return;
			}
			
			res.writeHeader(200, {'Content-Type': contentType},
						{'Authorization': 'Basic ' + token});
			res.write(file, 'binary');
			res.end();
			return;
		});
		
		return;
	}
		
		if (uri.indexOf('/attemptLogin') > -1){
			//console.log('begin validate');
				var credentials = url.parse(req.url, true).query;
				
				if (credentials){
					//console.log('has credential');
					var username = credentials.username;
					var password = credentials.password;
					
					if (!validate(username, password)){
						//console.log('Not a valid user');
						res.writeHead(401);
						res.write('401 Unauthorized');
						res.end();
						return;
					} else {
						//console.log('A valid user!');
						token = new Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
						
						res.writeHeader(200, {'Content-Type': contentType},
										{'Authorization': 'Basic ' + token});
						res.write('200 OK');
						res.end();
						
						return;
					}
				}
				
				//res.writeHead();
				return;
		}
		
		if (fs.statSync(fileName).isDirectory()) {
			fileName += 'index.html'; 
		}
		
		fs.readFile(fileName, 'binary', function( err, file){
				if (err) {					
					res.writeHead(500, {'Content-Type': contentType});
					res.write(err + '\n');
					res.end();
					return;
				}
				
			//console.log('hosting file: ' + fileName);
			res.writeHead(200);
			res.write(file, 'binary');
			res.end();
			
			//spawn('chrome.exe', ['http://localhost:8888']);
			return;
		});
		


}).listen(parseInt(PORT)); 

console.log('Server running at --> http://localhost:' + PORT + '/\nCTRL+C to shutdown');