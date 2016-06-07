var token = null,
	path = require('path'),
	url = require('url'),
	configs = require('./configurations.json'),
	responseService = require('./responseService.js'),
	fs = require('fs');
	
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

var isAuthorized = function(){
	if (token){
		return true;
	} 
	
	return false;
	
};
 
var renderFile = function (res, fileName, contentType){
		fs.readFile(fileName, 'binary', function(err, file){
			if (err) {
				console.log('error for file : ' + fileName + ' err: ' + err);
				responseService.write500InternalErrorResponse(res, err, contentType);
				return;
			}
			
			responseService.write200SuccessResponse(res, file, contentType, token);
		});
	};

module.exports = {
	handleGetRequest: function (res, req, url, contentType){
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
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				fileName = currentWorkingDir + "\\src\\" + "user-configurations.html";
				
				renderFile(res, fileName, contentType);
				break;
			case '/configs':
				if (!isAuthorized()){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(configs));
				res.end();
				break;
			case '/validateUser':
				var qry = url.parse(req.url, true).query;
				var authHeader = req.headers['authorization']; 
				if (authHeader){
					var auth = authHeader.split(' ')[1];
					var credString = new Buffer(auth, 'base64').toString();
					  
					var credentials = credString.split(':');
					  
					if (credentials){
						var username = credentials[0];
						var password = credentials[1];
						
						if (!validate(username, password)){
							responseService.write401Unauthorized(res);
							return;
						} else {
							token = new Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
							responseService.write200SuccessResponse(res, null, contentType, token);
							return;
						}
					}
				}
				
				responseService.write401Unauthorized(res, contentType);
				break;
			default:
				responseService.write404NotFoundResponse(res, contentType);
		}
	},
	handlePostRequest: function (res, req, contentType){
		var currentWorkingDir = process.cwd(),
		fileName = currentWorkingDir + '\\src\\configurations.json',
		uri = url.parse(req.url).pathname;
	
		switch (uri) {
			case '/logout':
				token = null;
				responseService.write204NoContentResponse(res);
				break;
			case '/configs':
			var data = '';
				req.on('data', function(chunk){
				data += chunk;
				});
				
				req.on('end', function(){
					var addedConfig =  JSON.parse(data).config,
						configurations = configs.configurations;

					if (addedConfig){
						if (!configurations){
							configurations = { addedConfig };
						} else {
							configurations.push(addedConfig);
						}
						
						fs.writeFileSync(fileName, JSON.stringify(configurations));
						responseService.write204NoContentResponse(res);
						return;
					}
				});
				
				return;
			default:
				responseService.write404NotFoundResponse(res, contentType);
			}
		;
	},
	
	handlePutRequest: function(res, req, contentType){
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
					responseService.write204NoContentResponse(res);
					return;
				}
			});
			
			return;
		}
	
		responseService.write404NotFoundResponse(res, contentType);
	},
	handleDeleteRequest: function(res, reqUrl, contentType){
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
	}
};
