function Router(path, fileSystem, responseService, authRouter, url) {
	return {
		routeGet: function(currentWorkingDir, res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			
			var fileName = path.join(currentWorkingDir, uri);
				
			/*if ((uri.indexOf('web') > -1)){
				console.log('loading: ' + uri);
				this.renderFile(res, fileName, contentType);
			    return;
			}*/			
						
			authRouter.routeGet(fileName, res, req, contentType);
		},
		loadDependencies: function (res, fileName, contentType) {
			
		},
		renderFile: function (res, fileName, contentType){
			fileSystem.readFile(fileName, 'binary', function(err, file){
				if (err) {
					console.log('error rendering file : ' + fileName + ' err: ' + err);
					responseService.write500InternalError(res, err);
					return;
				}
				
				responseService.write200Success(res, file, fileName, contentType);
			});
		}
	};
}
