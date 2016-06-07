var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	configs = require('./src/configurations.json'),
	token = null,
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
		if (userName.toLowerCase() === users[i].username.toLowerCase() && password === users[i].password){
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

var write204NoContentResponse = function (res){
	res.writeHead(204);
	res.write('204 No Content');
	res.end();
	
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

var write405MethodNotAllowed = function (res, contentType){
	res.writeHeader(405, {'Content-Type': contentType},
		{'Allow': 'GET'});
	res.write('405 Method Not Allowed');
	res.end();
}
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

var isAuthorized = function(){
	if (token){
		return true;
	} 
	
	return false;
	
};

var handleGetRequest = function (res, req, contentType){
	var currentWorkingDir = process.cwd();
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(currentWorkingDir, uri);
		
	if ((uri.indexOf('node_modules') > -1) || uri.indexOf('src') > -1){
		renderFile(res, fileName, contentType);
		return;
	}
	
	switch (uri){
		case '/':
			fileName += 'src/index.html';
			renderFile(res, fileName, contentType);
			break;
		case '/user-configurations':
			if (!isAuthorized()){
				write401Unauthorized(res, contentType);
				return;
			}
			
			fileName = currentWorkingDir + "\\src\\" + "user-configurations.html";
			
			renderFile(res, fileName, contentType);
			break;
		case '/configs':
			if (!isAuthorized()){
				write401Unauthorized(res, contentType);
				return;
			}
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(configs));
			res.end();
			break;
		case '/validateUser':
			/*if (!isAuthorized()){
				write401Unauthorized(res, contentType);
				return;
			}*/
			var qry = url.parse(req.url, true).query;
			 var authHeader = req.headers['authorization'];
			 var auth = authHeader.split(' ')[1];
			  var credString = new Buffer(auth, 'base64').toString();
			  
			  var credentials = credString.split(':');
			  
			if (credentials){
				var username = credentials[0];
				var password = credentials[1];
				
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
			write404NotFoundResponse(res, contentType);
	}
};

var handlePostRequest = function(res, reqUrl, contentType){
	var currentWorkingDir = process.cwd();
	var uri = url.parse(reqUrl).pathname;
	
	switch (uri) {
		case '/logout':
			token = null;
			write204NoContentResponse(res);
			break;
		default:
			write404NotFoundResponse(res, contentType);
	}
};

var handlePutRequest = function(res, req, contentType){
	var data = '', index = null, currentWorkingDir = process.cwd(),
		fileName = currentWorkingDir + '\\src\\configurations.json';
		uri = url.parse(req.url).pathname;
	if (uri === '/configs'){
		req.on('data', function(chunk){
			data += chunk;
		});
		
		req.on('end', function(){
			var updatedConfig =  JSON.parse(data).config,
				configurations = configs.configurations;
			
			for (var i = 0; i < configurations.length; i++){
				if (configurations[i].username === updatedConfig.username){
					index = configurations.indexOf(configurations[i]);
				}
			}
			
			if (index > -1){
				configurations[index] = updatedConfig;
				fs.writeFileSync(fileName, JSON.stringify(configurations));
				write204NoContentResponse(res);
				return;
			}
		});
		
		return;
	}
	
	write404NotFoundResponse(res, contentType);
};

var handleDeleteRequest = function(res, reqUrl, contentType){
	var currentWorkingDir = process.cwd();
	var id = url.parse(reqUrl, true).query;
	var configurations = configs.configurations;
	var fileName = currentWorkingDir + '\\src\\configurations.json';
	
	var index = null;
	for (var i = 0; i < configurations.length; i++){
		if (configurations[i].username === id){
			index = configurations.indexOf(configurations[i]);
		}
	}
	
	if (index > -1){
		configurations.splice(index, 1);
		//overwrite file with new json object
		fs.writeFileSync(fileName, JSON.stringify(configurations));
		res.writeHead(204);
		res.end();
		return;
	}
	
	res.writeHead(404);
	res.end();
	return;
};

http.createServer(function (req, res) {
	var contentType, 
	contentType = setContentType(req.url);
	
	switch (req.method){
		case 'GET':
			handleGetRequest(res, req, contentType);
			break;
		case 'POST':
			handlePostRequest(res, req.url, contentType);
			break;
		case 'PUT':
			handlePutRequest(res, req, contentType);
			break;
		case 'DELETE':
			handleDeleteRequest(res, req.url, contentType);
			break;
		default:
	}
	 
}).listen(parseInt(PORT, 10)); 

console.log('Server running at --> http://localhost:' + PORT + '/\nCTRL+C to shutdown');