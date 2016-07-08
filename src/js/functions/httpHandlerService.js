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