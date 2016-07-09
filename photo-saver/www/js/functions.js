/*
 * functions v  (build 20160709_090205_1)
 * Copyright (c) 2016
 * Author: Chad Keibler 
 */

function Authentication(usersJson) {
	return {
		validateUser: function(userName, password){
		var users = usersJson.users;
		for (var i = 0; i <= users.length - 1; i++){
			if (userName.toLowerCase() === users[i].username.toLowerCase() && password === users[i].password){
				return true;
			}
		}
		
		return false;
		},
		isAuthorized: function (token){
			if (token){
				return true;
			}
			
			return false;
		}
	};
}

module.exports = Authentication;

var configs, sort, paginate;

function ConfigPageObjCreator (){
	return {
		init: function (userConfigs, sorter, paginator){
			configs = userConfigs;
			sort = sorter;
			paginate = paginator;
		},
		getSortedPageObj: function(pg, pageSize, sortBy, sortOrder){
			var page, sorted = null, finalConfigs = configs.configurations;
			if (!pg){
				page = 1;
			} else {
				page = pg;
			}
			
			if (sortOrder){
				if (sortOrder.toLowerCase() === 'desc') {
					sorted = sort.getSortDesc(sortBy);
				} else {
					sorted = sort.getSortAsc(sortBy);
				}
			}
			
			if (sorted) {
				if (pageSize) {
					finalConfigs = paginate.paginateUserConfigs(sorted, pageSize, page);
				}
			}
			
			var sortedReturnObj = {};
			sortedReturnObj.sorted = finalConfigs;
			sortedReturnObj.total = configs.configurations.length;
			
			return sortedReturnObj;
		} 
	};
}

module.exports = ConfigPageObjCreator;
function HttpHandler (path, currentWorkingDir, configs, authentication, router, responseService) {
	var userConfigsFileName = path.join(currentWorkingDir, '/configurations.json');
	
	return {
		handleGetRequest: function (res, req, contentType){		
			router.get(res, req, contentType);
			return;
		},
		handlePostRequest: function (res, req, contentType){
			router.post(userConfigsFileName, res, req, contentType);
			return;
		},
		
		handlePutRequest: function(res, req, contentType){
			var data = '', index = null;
			router.put(userConfigsFileName, res, req, contentType);
			return;
		},
		handleDeleteRequest: function(res, req, contentType){
			router.delete(userConfigsFileName, res, req, contentType);
			return;
		}
	};
} 

module.exports = HttpHandler;
function Paginator(userConfigs){
	return {
		paginateUserConfigs: function (sorted, pageSize, page){
			var paginatedConfigs = null;
			if (userConfigs.configurations.length > pageSize) {
				if (parseInt(page) > 1) {
					var startIndex = (parseInt(pageSize) * (parseInt(page) - 1));
					var endIndex = userConfigs.configurations.length;
				
					if (parseInt(startIndex) > parseInt(endIndex)) {
						paginatedConfigs = sorted.slice(startIndex, startIndex + pageSize);
					} else { 
						if ((parseInt(endIndex) - parseInt(startIndex)) > parseInt(pageSize)) {
							endIndex = parseInt(startIndex) + parseInt(pageSize);
						} 
						
						paginatedConfigs = sorted.slice(startIndex, endIndex);
					}
				} else {
				paginatedConfigs = sorted.slice(0, pageSize);
				}
			} else {
				paginatedConfigs = sorted;
			}
			
			return paginatedConfigs;
		}
	};
}

module.exports = Paginator;
function ResponseService() {
	return {
		write200Success: function (res, file, fileName, contentType){ 
			 	if (file){
					res.writeHeader(200, {'Content-Type': contentType});
					res.write(file, 'binary');
					res.end();
					return;
				} else {
					res.writeHeader(200);
					res.write('200 OK');
					res.end();
					return;
				}
		},
		write200OKWithData: function (res, object) {
			res.writeHeader(200, {'Content-Type': 'application/json'});
			res.write(JSON.stringify(object));
			res.end();
		},
		write204NoContent: function (res){
			res.writeHeader(204);
			res.write('204 No Content');
			res.end();
		},
		write400BadRequest: function (res) {
			res.writeHeader(400);
			res.write('400 Bad Request');
			res.end();
		},
		write401Unauthorized: function (res){
			res.writeHeader(401);
			res.write('401 Unauthorized');
			res.end();
		},
		write404NotFound: function (res){
			res.writeHeader(404);
			res.write('404 Not Found');
			res.end();
		},
		write405MethodNotAllowed: function (res){
			res.writeHeader(405, {'Allow': 'GET'});
			res.write('405 Method Not Allowed');
			res.end();
		},
		write500InternalError: function (res, err){
			res.writeHeader(500);
			res.write('500 Internal Server Error: ' + err + '\n');
			res.end();
		}
	};
}

module.exports = ResponseService;
var token = null, path, fileSystem, url, currentWorkingDir, configPageObjCreator, 
	authentication, responseService, configs, Buffer,
	indexHtml = './index.html';

function Router(path, fileSystem, url, currentWorkingDir, configPageObjCreator, authentication, responseService, configs, Buffer) {
	return {
		renderFile: function (res, fileName, contentType){
				fileSystem.readFile(fileName, 'binary', function(err, file){
					if (err) {
						console.log('error for file : ' + fileName + ' err: ' + err);
						responseService.write500InternalError(res, err);
						return;
					}
                                    
                                    console.log('rendering file: ' + fileName);
					 
					responseService.write200Success(res, file, fileName, contentType);
					return;
				});
		},
		get: function (res, req, contentType){
			var uri = url.parse(req.url).pathname;
			var fileName = path.join(currentWorkingDir, uri);
			
			switch (uri.trim().toLowerCase()){
				case '/':
					this.renderFile(res, indexHtml, contentType);
					return;
				case '/validateuser':
					var authHeader = req.headers.authorization;
					if (authHeader){
						var auth = authHeader.split(' ')[1];
						
						var credString = Buffer(auth, 'base64').toString();
						var credentials = credString.split(':');
						
						if (credentials){
							var username = credentials[0];
							var password = credentials[1];
							
							if (!authentication.validateUser(username, password)){
								responseService.write401Unauthorized(res);
								return;
							} else {
								token = Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
								responseService.write200Success(res, null, fileName, contentType, token);
								return;
							}
						}
					}
				
					responseService.write401Unauthorized(res);
					return;
				case '/user-configurations':
					if (!authentication.isAuthorized(token)){
						responseService.write401Unauthorized(res);
						return;
					}
					
					this.renderFile(res, indexHtml, contentType);
					return;
				case '/configs':
					var page = url.parse(req.url, true).query.page;
					var pageSize = url.parse(req.url, true).query.pagesize;
					var sortBy = url.parse(req.url, true).query.sortby;
					var sortOrder = url.parse(req.url, true).query.sortorder;
					
					var returnObj = {};
					returnObj = configPageObjCreator.getSortedPageObj(page, pageSize, sortBy, sortOrder);
					responseService.write200OKWithData(res, returnObj);
					return;
				default:
					this.renderFile(res, fileName, contentType);
					return;				
			}
				 
			return;
		},
		post: function (fileName, res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			switch (uri) {
				case '/logout':
					token = null;
					responseService.write204NoContent(res);
					break;
				case '/configs':
					var addSuccess = false;
					var data = '';
					
					if (!authentication.isAuthorized(token)){
						responseService.write401Unauthorized(res);
						return;
					}
					
					req.on('data', function(chunk){
						if (chunk) {
							data += chunk;
						}
					});
				
					req.on('end', function(){
						if (data.length > 0){
							var addedConfig =  JSON.parse(data).config;
							if (addedConfig){
								if (!configs.configurations){
									configs.configurations = { config: addedConfig };
									addSuccess = true;
								} else {
									configs.configurations.push(addedConfig);
									addSuccess = true;
								}
							}
							
							if (addSuccess){
								fileSystem.writeFileSync(fileName, JSON.stringify(configs));
								responseService.write204NoContent(res);
								return;
							} else {
								responseService.write500InternalError(res, 'Internal Server Error');
								return;
							}
						} else {
							responseService.write400BadRequest(res);
						}
					});
					
					return;
				default:
					responseService.write404NotFound(res);
				}
		},
		put: function (fileName, res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			if (!authentication.isAuthorized(token)){
				responseService.write401Unauthorized(res);
				return;
			}
			
			switch (uri) {
				case '/configs':
					var data = '';
					req.on('data', function(chunk){
						if (chunk) {
							data += chunk;
						}
					});
					
					req.on('end', function(){
						if (data.length > 0){
							var index;
							var updatedConfig =  JSON.parse(data).config;
							
							for (var i = 0; i < configs.configurations.length; i++){
								if (configs.configurations[i].username === updatedConfig.username){								
									index = configs.configurations.indexOf(configs.configurations[i]);
								}
							}
							
							if (index > -1){
								configs.configurations[index] = updatedConfig;
								fileSystem.writeFileSync(fileName, JSON.stringify(configs));
								responseService.write204NoContent(res);
								return;
							}
						} else {
							responseService.write400BadRequest(res);
						}
					});
					break;
				default:
					responseService.write404NotFound(res);
			}
		},
		delete: function (fileName, res, req, contentType) {
			var id = url.parse(req.url, true).query.id;
			var uri = url.parse(req.url).pathname;
			
			if (!authentication.isAuthorized(token)){
				responseService.write401Unauthorized(res);
				return;
			}
			
			switch (uri) {
				case '/configs': 
					var index = null;
					for (var i = 0; i < configs.configurations.length; i++){
						if (configs.configurations[i].username === id){
							index = configs.configurations.indexOf(configs.configurations[i]);
						}
					}
				
					if (index > -1){
						configs.configurations.splice(index, 1);
						fileSystem.writeFileSync(fileName, JSON.stringify(configs));
						res.writeHeader(204);
						res.end();
						return;
					}
					
					break;
				default: 
				responseService.write404NotFound(res);
			}
		}		
	};
}
	
module.exports = Router;
/*TODO: add better support for sorting by a url (ex: hostname)*/
function Sorter (userConfigs) {
	return {
		sortByHostNameAsc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.hostname.toLowerCase() < y.hostname.toLowerCase()){
				return -1;
			}
			if (x.hostname.toLowerCase() > y.hostname.toLowerCase()){
				return 1;
			}
			
			return 0;
			});
		},
		sortByUserNameAsc: function (){
			return userConfigs.configurations.sort(function(x, y) {
				if (x.username.toLowerCase() < y.username.toLowerCase()){
					return -1;
				}
				if (x.username.toLowerCase() > y.username.toLowerCase()){
					return 1;
				}
				
				return 0;
			});
		},
		sortByPortAsc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.port < y.port){
				return -1;
			}
			if (x.port > y.port){
				return 1;
			}
			
			return 0;
			});
		},
		sortByNameAsc: function (){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.name.toLowerCase() < y.name.toLowerCase()){
				return -1;
			}
			if (x.name.toLowerCase() > y.name.toLowerCase()){
				return 1;
			}
			
			return 0;
			}); 
		},
		getSortAsc: function (sortBy) {
			if (sortBy) {
				if (sortBy.toLowerCase() === 'hostname') {
					return this.sortByHostNameAsc();
				} else if (sortBy.toLowerCase() === 'port') {
					return this.sortByPortAsc();
				} else if (sortBy.toLowerCase() === 'username') {
					return this.sortByUserNameAsc();
				}
			}
			
			return this.sortByNameAsc();
		},
		sortByNameDesc: function (){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.name.toLowerCase() > y.name.toLowerCase()){
				return -1;
			}
			if (x.name.toLowerCase() < y.name.toLowerCase()){
				return 1;
			}
			
			return 0;
			}); 
		},
		sortByHostNameDesc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.hostname.toLowerCase() > y.hostname.toLowerCase()){
				return -1;
			}
			if (x.hostname.toLowerCase() < y.hostname.toLowerCase()){
				return 1;
			}
			
			return 0;
			});
		},
		sortByPortDesc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.port > y.port){
				return -1;
			}
			if (x.port < y.port){
				return 1;
			}
			
			return 0;
			});
		},
		sortByUserNameDesc: function (){
			return userConfigs.configurations.sort(function(x, y) {
				if (x.username.toLowerCase() > y.username.toLowerCase()){
					return -1;
				}
				if (x.username.toLowerCase() < y.username.toLowerCase()){
					return 1;
				}
				
				return 0;
			});
		},
		getSortDesc: function (sortBy){
			if (sortBy) {
				if (sortBy.toLowerCase() === 'hostname') {
					return this.sortByHostNameDesc();
				} else if (sortBy.toLowerCase() === 'port') {
					return this.sortByPortDesc();
				} else if (sortBy.toLowerCase() === 'username') {
					return this.sortByUserNameDesc();
				}
			}
						
			return this.sortByNameDesc();
		}
	};
}

module.exports = Sorter;