var token = null;

function AuthRouter(path, fileSystem, url, currentWorkingDir, configPageObjCreator, authentication, responseService, configs) {
	return {
		routeGet: function (fileName, uri, res, req, contentType){
			if (uri === '/validateUser'){
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
				return;
			} else {
				if (!authentication.isAuthorized(token)){
					responseService.write401Unauthorized(res, contentType);
					return;
				}
				
				switch (uri){
				case '/user-configurations':
					
					
					fileName = currentWorkingDir + "\\src\\views\\" + "user-configurations.html";
					
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
					responseService.write404NotFoundResponse(res, contentType);
				}
			}
		},
		routePost: function (fileName, uri, res, req, contentType) {
			switch (uri) {
				case '/logout':
					token = null;
					responseService.write204NoContentResponse(res);
					break;
				case '/configs':
					var addSuccess = false;
					var data = '';
					if (!authentication.isAuthorized(token)){
						responseService.write401Unauthorized(res, contentType);
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
		routePut: function (fileName, uri, res, req, contentType) {
			if (!authentication.isAuthorized(token)){
				responseService.write401Unauthorized(res, contentType);	
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
							responseService.write204NoContentResponse(res);
							return;
						}
					});
					break;
				default:
					responseService.write404NotFoundResponse(res, contentType);
			}
		},
		routeDelete: function (fileName, uri, res, req, contentType, id) {
			if (!authentication.isAuthorized(token)){
				responseService.write401Unauthorized(res, contentType);
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
				responseService.write404NotFoundResponse(res, contentType);
			}
		},
		renderFile: function (res, fileName, contentType){
			fileSystem.readFile(fileName, 'binary', function(err, file){
				if (err) {
					console.log('error for file : ' + fileName + ' err: ' + err);
					responseService.write500InternalErrorResponse(res, err, contentType);
					return;
				}
				
				responseService.write200SuccessResponse(res, file, contentType, token);
			});
		}
	}
}

module.exports = AuthRouter;
	