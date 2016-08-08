function HttpHandler (path, currentWorkingDir, configs, authentication, router, authRouter, responseService) {
	var userConfigsFileName = path.join(currentWorkingDir, 'src/configurations.json');
	
	return {
		handleGetRequest: function (res, req, contentType){
			router.routeGet(currentWorkingDir, res, req, contentType);
			return;
		},
		handlePostRequest: function (res, req, contentType){
			authRouter.routePost(userConfigsFileName, res, req, contentType);
			return;
		},
		
		handlePutRequest: function(res, req, contentType){
			var data = '', index = null;
			authRouter.routePut(userConfigsFileName, res, req, contentType);
			return;
		},
		handleDeleteRequest: function(res, req, contentType){
			authRouter.routeDelete(userConfigsFileName, res, req, contentType);
			return;
		}
	}
}

module.exports = HttpHandler;