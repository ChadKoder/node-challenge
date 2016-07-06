function Router(path, fileSystem, responseService, authRouter, url) {
	return {
		routeGet: function(currentWorkingDir, res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			var fileName = path.join(currentWorkingDir, uri);
						
			authRouter.routeGet(fileName, res, req, contentType);
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

module.exports = Router;