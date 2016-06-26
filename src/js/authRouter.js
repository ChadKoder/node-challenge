var token = null,
	userConfigurationHtml = 'src/views/user-configurations.html';

function AuthRouter(path, fileSystem, url, currentWorkingDir, configPageObjCreator, authentication, responseService, configs) {
	return {
		routeGet: function (fileName, uri, res, req, contentType){
			if (uri === '/validateUser'){
				console.log('heere111: ' + JSON.stringify(req));
				var authHeader = req.headers['authorization']; 				
				if (authHeader){
					console.log('heere222');
					 
					var auth = authHeader.split(' ')[1];
					var credString = new Buffer(auth, 'base64').toString();
					  
					var credentials = credString.split(':');
					  console.log('heere333');
					if (credentials){
						var username = credentials[0];
						var password = credentials[1];
						
						if (!authentication.validateUser(username, password)){
							responseService.write401Unauthorized(res);
							return;
						} else {
							token = new Buffer('username:' + username + ',' + 'password:' + password).toString('base64');
							responseService.write200Success(res, null, fileName, contentType, token);
							return;
						}
					}
				}
				
				responseService.write401Unauthorized(res);
				return;
			} else {
				if (!authentication.isAuthorized(token)){
					responseService.write401Unauthorized(res);
					return;
				}
				
				switch (uri){
				case '/user-configurations':
					fileName = path.join(currentWorkingDir, userConfigurationHtml);
					
					this.renderFile(res, fileName, contentType);
					break;
				case '/configs':
					var page = url.parse(req.url, true).query.page;
					var pageSize = url.parse(req.url, true).query.pagesize;
					var sortBy = url.parse(req.url, true).query.sortby;
					var sortOrder = url.parse(req.url, true).query.sortorder;
					
					var returnObj = {};
					returnObj = configPageObjCreator.getSortedPageObj(page, pageSize, sortBy, sortOrder);
					
					res.setHeader('Content-Type', 'application/json');
					res.write(JSON.stringify(returnObj));
					res.end();
					break;
				default:
					responseService.write404NotFound(res);
				}
			}
		},
		routePost: function (fileName, uri, res, req, contentType) {
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
								fileSystem.writeFileSync(fileName, JSON.stringify(configs));
								responseService.write204NoContent(res);
								return;
							} else {
								responseService.write500InternalError(res, 'Internal Server Error');
								return;
							}
						}
					});
					
					return;
				default:
					responseService.write404NotFound(res);
				};
		},
		routePut: function (fileName, uri, res, req, contentType) {
			if (!authentication.isAuthorized(token)){
				responseService.write401Unauthorized(res);	
				return;
			}
			
			switch (uri) {
				case '/configs':
					var data = '';
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
							fileSystem.writeFileSync(fileName, JSON.stringify(configs));
							responseService.write204NoContent(res);
							return;
						}
					});
					break;
				default:
					responseService.write404NotFound(res);
			}
		},
		routeDelete: function (fileName, uri, res, req, contentType, id) {
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
						res.writeHead(204);
						res.end();
						return;
					}
					
					break;
				default: 
				responseService.write404NotFound(res);
			}
		},
		renderFile: function (res, fileName, contentType){
			fileSystem.readFile(fileName, 'binary', function(err, file){
				if (err) {
					console.log('error for file : ' + fileName + ' err: ' + err);
					responseService.write500InternalError(res, err);
					return;
				}
				
				responseService.write200Success(res, file, fileName, contentType);
			});
		}
	}
}

module.exports = AuthRouter;
	