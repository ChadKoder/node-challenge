var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	configs = require('./src/configurations.json'),
	token = '',
	childProcess = require('child_process'),
	browserToLaunch = '',
	chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	iexplore = 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe',
	arg = process.argv[2], userArg = null;
	
const PORT = 8888;

if (arg){
	userArg = arg.toLowerCase();
}
	
if (userArg){
	console.log('attempting to run node with ' + userArg + '...');
	
	if (userArg === 'chrome'){
		try {
			fs.statSync(chrome);
			browserToLaunch = chrome;
		} catch(e) {
			console.log('chrome does not exist, setting to launch with iexplore');
			browserToLaunch = iexplore;
		}
	} else if (userArg === 'iexplore'){
		try {
			fs.statSync(iexplore);
			browserToLaunch = iexplore;
		} catch(e) {
			console.log('iexplore does not exist, please manually launch your browser and navigate to "http://localhost:8888"');
			browserToLaunch = '';
		}
	} else if (userArg === 'tests/') {
		browserToLaunch = null;
		return;
	}
}

if (browserToLaunch){
	childProcess.spawn(browserToLaunch, ['http://localhost:8888']);
}

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

var setContentType = function (url) {
	var contentType = 'text/html';
	
	if (urlContains(url, '.html')){
		contentType = 'text/html';
	} else if (urlContains(url, '.css')){
		contentType = 'text/css';
	} else if (urlContains(url, '.js')) {
		contentType = 'text/javascript';
	}
	
	return contentType;
};

var write200SuccessResponse = function (res, file, contentType){
	if (token) {
		if (file){
			res.writeHeader(200, {'Content-Type': contentType},
		{'Authorization': 'Basic ' + token});
			res.write(file, 'binary');
			res.end();
			return;
		} else {
			res.writeHead(200);
			res.write('200 OK');
			res.end();
			return;
		}
		
		res.end();
		return;
	} else {
		if (file){
			res.writeHead(200);
			res.write(file, 'binary');
			res.end();
			return;
		} else {
			res.writeHead(200);
			res.write('200 OK');
			res.end();
			return;
		}
	}
};

var write404NotFoundResponse = function(res, contentType){
	res.writeHead(404, {'Content-Type': contentType });
	res.write('404 Not Found');
	res.end();
};

var write500InternalErrorResponse = function(res, err, contentType){
	res.writeHead(500, {'Content-Type': contentType});
	res.write(err + '\n');
	res.end();
};

var write401Unauthorized = function(res, contentType){
	res.writeHead(401, {'Content-Type': contentType});
	res.write('401 Unauthorized');
	res.end();
};

var renderFile = function (res, fileName, contentType){
	fs.readFile(fileName, 'binary', function(err, file){
		if (err) {
			console.log('error for file : ' + fileName + ' err: ' + err);
			write500InternalErrorResponse(res, err, contentType);
			return;
		}
		
		write200SuccessResponse(res, file, contentType);
	});
};

http.createServer(function (req, res) {
	var contentType, currentWorkingDir = process.cwd(),
	uri = url.parse(req.url).pathname,
	fileName = path.join(currentWorkingDir, uri),
	contentType = setContentType(req.url);
	
	if ((uri.indexOf('node_modules') > -1) || uri.indexOf('src') > -1){
		renderFile(res, fileName, contentType);
		return;
	}
	
	switch (uri){
		case '/':
			if (fs.statSync(fileName).isDirectory()) {
				fileName += 'src/index.html';
			}
			
			renderFile(res, fileName, contentType);
			break;
		case '/user-configurations':
			//res.writeHead(200);
			//res.write('200 OK');
			if (token){
				
			}
			res.end();
			break;
		case '/configs':
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(configs));
			res.end();
			break;
		case '/attemptLogin':
			var credentials = url.parse(req.url, true).query;
		
			if (credentials){
				var username = credentials.username;
				var password = credentials.password;
				
				if (!validate(username, password)){
					write401Unauthorized(res);
					return;
				} else {
					token = new Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
					write200SuccessResponse(res, null, contentType);
					return;
				}
			}
		
			break;
		default:
			res.writeHead(404);
			res.write('404 Not Found');
			res.end();
	}
	
		 
}).listen(parseInt(PORT, 10)); 

console.log('Server running at --> http://localhost:' + PORT + '/\nCTRL+C to shutdown');