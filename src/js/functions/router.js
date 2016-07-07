var token = null, path, fileSystem, url, currentWorkingDir, configPageObjCreator, 
	authentication, responseService, configs, Buffer,
	indexHtml = './index.html';

function Router(path, fileSystem, url, currentWorkingDir, configPageObjCreator, authentication, responseService, configs, Buffer) {
	return {
		renderFile: function (res, fileName, contentType){
			var fName;
			//console.log('attempting to load file: ' + fileName);
			if (fileSystem.lstatSync(fileName).isDirectory()) {
				//console.log('IS a Directory: ' + fileName);
				//console.log('IT IS a dir: ' + fileName);
				var files = fileSystem.readdirSync(fileName);
				
				for (var i = 0; i <= files.length - 1; i++){
					//console.log('attempting to load fileName: ' + files[i]);
					if (fileSystem.lstatSync(files[i]).isDirectory()){
						console.log('222:  IS A SUB Directory: ' + files[i]);
						
						var subFiles = fileSystem.readdirSync(files[i]);
						
						for (var j = 0; j <= subFiles.length - 1; j++){	
							console.log('sub directory... building from... ');
							console.log('1: ' + currentWorkingDir);
							console.log('2: ' + files[i]);
							console.log('3: ' + subFiles[j]);
							var tempName = path.join(currentWorkingDir, files[i]);
							var fName = path.join(tempName, subFiles[j]);
							
							//var tempName = path.join(files[i], fileName);
							//var tempName = path.join(files[i],)
							//fName = path.join(tempName, subFiles[i]);
							
							//console.log('attempting to load sub file : ' + fName);
							fileSystem.readFile(fName, 'binary', function(err, file){
								if (err) {
									console.log('error for file : ' + subFiles[j] + ' err: ' + err);
									responseService.write500InternalError(res, err);
									return;
								}
								 
								responseService.write200Success(res, file, fileName, contentType);
								return;
							});
						}	
						
					} else {
							
						//console.log('rendering file: ' + fName);
						fileSystem.readFile(files[i], 'binary', function(err, file){
							if (err) {
								console.log('error for file : ' + files[i] + ' err: ' + err);
								responseService.write500InternalError(res, err);
								return;
							}
							 
								responseService.write200Success(res, file, fileName, contentType);
								return;
							});
					}
				}
			} else {
				console.log('NOT A directory: ' + fileName);
				fileSystem.readFile(fileName, 'binary', function(err, file){
					if (err) {
						console.log('error for file : ' + fileName + ' err: ' + err);
						responseService.write500InternalError(res, err);
						return;
					}
					 
					responseService.write200Success(res, file, fileName, contentType);
					return;
				});
			}
			return;
		},
		get: function (fileName, res, req, contentType){
			var uri = url.parse(req.url).pathname;
		
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