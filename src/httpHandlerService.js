var token = null,
	pageSize = 5,
	path = require('path'),
	url = require('url'),
	configs = require('./configurations.json'),
	responseService = require('./responseService.js'),
	fs = require('fs'),
	sorter = require('./sorter.js'),
	authentication = require('./authentication.js');

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
				if (!authentication.isAuthorized(token)){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				fileName = currentWorkingDir + "\\src\\" + "user-configurations.html";
				
				renderFile(res, fileName, contentType);
				break;
			case '/configs':
				if (!authentication.isAuthorized(token)){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				var page = url.parse(req.url, true).query.page;
				var sortBy = url.parse(req.url, true).query.sortby;
				var sortOrder = url.parse(req.url, true).query.sortOrder;
				
				if (page && sortBy){
					var sorted;
					var sortedAndPaged = configs.configurations;
					
					if (sortBy.toLowerCase() === 'name'){
						sorted = sorter.sortByNameAsc();
					}
					if (sortBy.toLowerCase() === 'hostname'){
						sorted = sorter.sortByHostNameAsc();
					}
					if (sortBy.toLowerCase() === 'port'){
						sorted = sorter.sortByPortAsc();
					}
					if (sortBy.toLowerCase() === 'username'){
						sorted = sorter.sortByUserNameAsc();
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
								if ((endIndex - startIndex) > 5){
									endIndex = startIndex + 5;
								}
								
								sortedAndPaged = sorted.slice(startIndex, endIndex);
							}
						} else {
							sortedAndPaged = sorted.slice(0, pageSize);
							
						}
					} else {
						sortedAndPaged = sorted.slice(0, pageSize);
					}
					
					var returnObj = {};
					returnObj.sorted = sortedAndPaged;
					returnObj.total = configs.configurations.length;
					
					res.setHeader('Content-Type', 'application/json');
					res.write(JSON.stringify(returnObj));
					res.end();
					return;
				}
				
				var returnObj = {};
				
				returnObj.sorted = configs.configurations;
				returnObj.total = configs.configurations.length;
				
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(returnObj));
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
						
						if (!authentication.validateUser(username, password)){
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
			console.log('HEEEERE');
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
				var addSuccess = false;
				if (!authentication.isAuthorized(token)){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				var data = '';
				req.on('data', function(chunk){
					data += chunk;
				});
				
				req.on('end', function(){
					if (data.length > 0){
						var addedConfig =  JSON.parse(data).config;
						
						if (addedConfig){
							if (!configs.configurations){
								configs.configurations = { addedConfig };
								addSuccess = true;
							} else {
								configs.configurations.push(addedConfig);
								addSuccess = true;
							}
						}
						
						if (addSuccess){
							fs.writeFileSync(fileName, JSON.stringify(configs));
							responseService.write204NoContentResponse(res);
							return;
						} else {
							responseService.write500InternalErrorResponse(res, 'Internal Server Error', contentType);
							return;
						}
					}
				});
				
				return;
			default:
				responseService.write404NotFoundResponse(res, contentType);
			};
	},
	
	handlePutRequest: function(res, req, contentType){
		var data = '', index = null, currentWorkingDir = process.cwd(),
			fileName = currentWorkingDir + '\\src\\configurations.json';
			uri = url.parse(req.url).pathname;
		
		if (!authentication.isAuthorized(token)){
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
		
		if (!authentication.isAuthorized(token)){
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
				fs.writeFileSync(fileName, JSON.stringify(configs));
				res.writeHead(204);
				res.end();
				return;
			}
		} else {
			responseService.write404NotFoundResponse(res, contentType);
		}
		
		res.writeHead(404);
		res.end();
		return;
	}
};
