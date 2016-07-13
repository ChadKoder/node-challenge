var path, fileSystem, url, currentWorkingDir, 
	responseService, Buffer;

function Router(path, fileSystem, url, currentWorkingDir, responseService, Buffer) {
	return {
		post: function (res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			
			switch (uri) {
				case '/photo':
					var imagedata = '';
					//res.setEncoding('binary');
					req.on('data', function(chunk){
						if (chunk) {
							imagedata += chunk;
						}
					});
					
					req.on('end', function(){
						if (imagedata.length > 0) {
							console.log('imagedata: ' + imagedata);
							 //data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        
							fileSystem.writeFile('test123photo.jpg', imagedata, 'binary', function(err) {
								if (err) {
									console.log('ERROR. file not saved.');
									responseService.write500InternalError(res, 'ERROR');
									return;
								}
								
								console.log('file SAVED!');
								responseService.write204NoContent(res);
								return;
							});
						}
					});
					
					return;
			
				default:
					responseService.write404NotFound(res);
				}
		}			
	};
}
	
module.exports = Router;