var path, fileSystem, url, currentWorkingDir, 
	responseService, Buffer;

function Router(path, fileSystem, url, currentWorkingDir, responseService, Buffer) {
	return {
		post: function (res, req, contentType) {
			var uri = url.parse(req.url).pathname;
			
			switch (uri) {
				case '/photo':
					var imagedata = '';
					req.on('data', function(chunk){
						if (chunk) {
							imagedata += chunk;
						}
					});
					
					req.on('end', function(){
						if (imagedata.length > 0) {
							console.log('retrieved data from /photo post...');
							var decodedImage = new Buffer(imagedata, 'base64');
						
							fileSystem.writeFile('base64data.txt', imagedata, function(err) {
								if (err){
									console.log('error writing imagedata.txt');
								}
								
								console.log('wrote imagedata.txt successfully');
							});
							
							
							var fileName = new Date().getUTCMilliseconds() + '.jpg';
							
							//does file exist?
							fileSystem.statSync('./' + fileName, function (err, stats) {
								if (err) {
									responseService.write500InternalError(res, 'Internal Server Error: Failed to get file.');
									return;
								}
							});
							
							
							
							fileSystem.writeFile('realBuffPic.jpg', decodedImage, function (err) {
								
								if (err) {
									console.log('error: ' + err);
									responseService.write500InternalError('Internal Server Error:' + err);
									return;
								}
								
								console.log('saved file successfully.');
								responseService.write204NoContent(res);
								return;
							});
							 
							
							 return;
						} else {
							responseService.write500InternalError(res, 'No data.');
							return;
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