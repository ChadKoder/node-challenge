function Router(path, fileSystem, responseService, authRouter, url) {
	return {
		routeGet: function(currentWorkingDir, res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			
			var fileName = path.join(currentWorkingDir, uri);
				
			if ((uri.indexOf('node_modules') > -1) || uri.indexOf('src') > -1){
				//this.loadDependencies(res, fileName, contentType);
				this.renderFile(res, fileName, contentType);
				return;
			}
						
			authRouter.routeGet(fileName, res, req, contentType);
			//fileName += 'src/views/index.html';
			//this.renderFile(res, fileName, contentType);
			
			//switch (uri){
				//case '/':
				//	fileName += 'src/views/index.html';
				//	this.renderFile(res, fileName, contentType);
				//	break;
			//	default:
					//authRouter.routeGet(fileName, res, req, contentType);
					
		//	}
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
				console.log('Rendering File111: ' + fileName);
				responseService.write200Success(res, file, fileName, contentType);
			});
		}
	};
}

module.exports = Router;
