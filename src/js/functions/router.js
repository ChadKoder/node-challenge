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
							var base64data = imagedata.replace('data:image/jpeg;base64,', '');
							
							var decodedImage = new Buffer(base64data
							 .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
							 
							var date = new Date();
							var month = date.getMonth();
							var day = date.getDate();
							var fileName = './photos/' + month + '_' + day + '_' + date.getUTCMilliseconds() + '.jpg';
							
							//does file exist?
							/*fileSystem.statSync('./' + fileName, function (err, stats) {
								if (err) {
									responseService.write500InternalError(res, 'Internal Server Error: Failed to get file.');
									return;
								}
							});
							
							fileSystem.writeFile('imagedataText.txt', base64data, function (err) {
								
								if (err) {
									console.log('error writing image data to text file.' + err);
									//responseService.write500InternalError('Internal Server Error:' + err);
									return;
								}
								
								console.log('wrote text file....');
								//responseService.write204NoContent(res);
								return;
							});*/
							
							fileSystem.writeFile(fileName, decodedImage, function (err) {
								
								if (err) {
									console.log('error: ' + err);
									responseService.write500InternalError('Internal Server Error:' + err);
									return;
								}
								
								console.log('saved file successfully... @' + date.toLocaleString() );
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