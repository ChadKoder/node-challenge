function Router(path, fileSystem, responseService, authRouter) {
	return {
		routeGet: function(fileName, uri, res, req, contentType) {
			switch (uri){
				case '/':
					fileName += 'src/views/index.html';
					this.renderFile(res, fileName, contentType);
					break;
				default:
					authRouter.routeGet(fileName, uri, res, req, contentType);
			}
		},
		loadDependencies: function (res, fileName, contentType) {
			this.renderFile(res, fileName, contentType);
		},
		renderFile: function (res, fileName, contentType){
			fileSystem.readFile(fileName, 'binary', function(err, file){
				if (err) {
					console.log('error rendering file : ' + fileName + ' err: ' + err);
					responseService.write500InternalError(res, err);
					return;
				}
				
				responseService.write200Success(res, file, contentType);
			});
		}
	}
}

module.exports = Router;
