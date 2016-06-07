var token = null,
	pageSize = 5,
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

var sortByName = function (){
	return configs.configurations.sort(function(x, y) {
		if (x.name.toLowerCase() < y.name.toLowerCase()){
			return -1;
		}
		if (x.name.toLowerCase() > y.name.toLowerCase()){
			return 1;
		}
		
		return 0;
	});
}

var sortByHostName = function (){
	return configs.configurations.sort(function(x, y) {
		if (x.hostname.toLowerCase() < y.hostname.toLowerCase()){
			return -1;
		}
		if (x.hostname.toLowerCase() > y.hostname.toLowerCase()){
			return 1;
		}
		
		return 0;
	});
}

var sortByPort = function (){
	return configs.configurations.sort(function(x, y) {
		if (x.port < y.port){
			return -1;
		}
		if (x.port > y.port){
			return 1;
		}
		
		return 0;
	});
}
var sortByUserName = function (){
	return configs.configurations.sort(function(x, y) {
		if (x.username.toLowerCase() < y.username.toLowerCase()){
			return -1;
		}
		if (x.username.toLowerCase() > y.username.toLowerCase()){
			return 1;
		}
		
		return 0;
	});
}
module.exports = {
	getToken: function () {
		//probably not the best thing to do, but this is just a sample app and its for unit testing.
		return token;
	},
	setToken: function (newVal){
		token = newVal;
	},
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
				
				//IF contains ?page=x..
				//then process page with pageSize--- default page size to 5??
				//else get ALL
				var page = url.parse(req.url, true).query.page;
				var sortBy = url.parse(req.url, true).query.sortby;
				
				if (page && sortBy){
					var sorted;
					var sortedAndPaged = configs.configurations;
					
					if (sortBy.toLowerCase() === 'name'){
						sorted = sortByName();
					}
					if (sortBy.toLowerCase() === 'hostname'){
						sorted = sortByHostName();
					}
					if (sortBy.toLowerCase() === 'port'){
						sorted = sortByPort();
					}
					if (sortBy.toLowerCase() === 'username'){
						sorted = sortByUserName();
					}
					
					if (sorted){
						sortedAndPaged = sorted;
					}
					
					if (configs.configurations.length > pageSize){
						if (page > 1){
							var startIndex = (pageSize * (page - 1));
							var endIndex = configs.configurations.length;
							
							if (startIndex > endIndex){
								sortedAndPaged = sorted.slice(startIndex, startIndex + pageSize);
							} else {
								sortedAndPaged = sorted.slice(startIndex,endIndex);
							}
						} else {
							sortedAndPaged = sorted.slice(0, pageSize);
							
						}
					} else {
						sortedAndPaged = sorted.slice(0, pageSize);
					}
					
					res.setHeader('Content-Type', 'application/json');
					res.write(JSON.stringify(sortedAndPaged));
					res.end();
					return;
				}
				
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(configs.configurations));
				res.end();
				break;
			case '/validateUser':
				var authHeader = req.headers['authorization']; 
				if (authHeader){
					var auth = authHeader.split(' ')[1];
					var credString = new Buffer(auth, 'base64').toString();
					  
					var credentials = credString.split(':');
					  
					if (credentials){
						var username = credentials[0];
						var password = credentials[1];
						
						if (!validate(username, password)){
							responseService.write401Unauthorized(res, contentType);
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
				if (!isAuthorized()){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				var data = '';
				req.on('data', function(chunk){
					data += chunk;
				});
				
				req.on('end', function(){
					var addedConfig =  JSON.parse(data).config;

					if (addedConfig){
						if (!configs.configurations){
							configs.configurations = { addedConfig };
						} else {
							configs.configurations.push(addedConfig);
							fs.writeFileSync(fileName, JSON.stringify(configs));
							responseService.write204NoContentResponse(res);
							return;
						}
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
		
		if (!isAuthorized()){
			responseService.write401Unauthorized(res, contentType);
			return;
		}
			
		if (uri === '/configs'){
			req.on('data', function(chunk){
				data += chunk;
			});
			
			req.on('end', function(){
				var updatedConfig =  JSON.parse(data).config;
				
				for (var i = 0; i < configs.configurations.length; i++){
					if (configs.configurations[i].username === updatedConfig.username){
						index = configs.configurations.indexOf(configs.configurations[i]);
					}
				}
				
				if (index > -1){
					configs.configurations[index] = updatedConfig;
					fs.writeFileSync(fileName, JSON.stringify(configs));
					responseService.write204NoContentResponse(res);
					return;
				}
			});
			
			return;
		}
	
		responseService.write404NotFoundResponse(res, contentType);
	},
	handleDeleteRequest: function(res, req, contentType){
		var currentWorkingDir = process.cwd();
		var id = url.parse(req.url, true).query.id;
		
		var uri = url.parse(req.url).pathname;
		var fileName = currentWorkingDir + '\\src\\configurations.json';
		
		if (!isAuthorized()){
			responseService.write401Unauthorized(res, contentType);
			return;
		}
		
		if (uri === '/configs'){
			var index = null;
			for (var i = 0; i < configs.configurations.length; i++){
				if (configs.configurations[i].username === id){
					index = configs.configurations.indexOf(configs.configurations[i]);
				}
			}
			
			if (index > -1){
				configs.configurations.splice(index, 1);
				//overwrite file with new json object
				fs.writeFileSync(fileName, JSON.stringify(configs));
				res.writeHead(204);
				res.end();
				return;
			}
		}
		
		res.writeHead(404);
		res.end();
		return;
	}
};
