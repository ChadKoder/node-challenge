module.exports = {
	write200SuccessResponse: function (res, file, contentType, token){
		if (token) {
			if (file){
				res.writeHeader(200, {'Content-Type': contentType},
			{'Authorization': 'Basic ' + token});
				res.write(file, 'binary');
				res.end();
				return;
			} else {
				res.writeHead(200);
				res.write('200 OK');
				res.end();
				return;
			}
			
			res.end();
			return;
		} else {
			if (file){
				res.writeHead(200);
				res.write(file, 'binary');
				res.end();
				return;
			} else {
				res.writeHead(200);
				res.write('200 OK');
				res.end();
				return;
			}
		}
	},
	write204NoContentResponse: function (res){
		res.writeHead(204);
		res.write('204 No Content');
		res.end();
	},
	write401Unauthorized: function (res, contentType){
		res.writeHead(401, {'Content-Type': contentType});
		res.write('401 Unauthorized');
		res.end();
	},
	write404NotFoundResponse: function (res, contentType){
		res.writeHead(404, {'Content-Type': contentType });
		res.write('404 Not Found');
		res.end();
	},
	write405MethodNotAllowed: function (res, contentType){
		res.writeHeader(405, {'Content-Type': contentType},
		{'Allow': 'GET'});
	res.write('405 Method Not Allowed');
	res.end();
	},
	write500InternalErrorResponse: function (res, err, contentType){
		res.writeHead(500, {'Content-Type': contentType});
		res.write(err + '\n');
		res.end();
	}
};
 