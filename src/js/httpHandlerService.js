function HttpHandler (path, url, currentWorkingDir, configs, authentication, router, authRouter, responseService) {
	var userConfigsFileName = path.join(currentWorkingDir, 'src/configurations.json');
	
	return {
		handleGetRequest: function (res, req, contentType){
			var uri = url.parse(req.url).pathname;
			var fileName = path.join(currentWorkingDir, uri);
			
			if ((uri.indexOf('node_modules') > -1) || uri.indexOf('src') > -1){
				router.loadDependencies(res, fileName, contentType);
				return;
			}
			
			router.routeGet(fileName, uri, res, req, contentType);
			return;
		},
		handlePostRequest: function (res, req, contentType){
			uri = url.parse(req.url).pathname;
			authRouter.routePost(userConfigsFileName, uri, res, req, contentType);
			return;
		},
		
		handlePutRequest: function(res, req, contentType){
			var data = '', index = null;
				uri = url.parse(req.url).pathname;
			authRouter.routePut(userConfigsFileName, uri, res, req, contentType);
			return;
		},
		handleDeleteRequest: function(res, req, contentType){
			var id = url.parse(req.url, true).query.id;
			var uri = url.parse(req.url).pathname;
			authRouter.routeDelete(userConfigsFileName, uri, res, req, contentType, id);
			return;
		}
	}
}

module.exports = HttpHandler;