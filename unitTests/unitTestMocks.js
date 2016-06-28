function UnitTestMocks() {
	return {
		response: {
			writeHeader: jasmine.createSpy('res.writeHeader'),
			write: jasmine.createSpy('res.write'),
			end: jasmine.createSpy('res.end'),
			setHeader: jasmine.createSpy('res.setHeader')
		},
		fileSystem: {
			readFile: jasmine.createSpy('fs.readFile')
		},
		request: function (headers, url){
			var req = { headers: {}, url: url};
			
			if (headers) {
				for (var i = 0; i < headers.length; i++){
					req.headers[headers[i].header] = headers[i].value; 
				}
			}
				
			return req;
		},
		path: {
			join: function (a, b) {
				if (a && b){
					return a.toString() + b.toString();
				}
			}
		},
		url: {
			parse: function (a, b) {
				return { pathname: a, query: { id: 'identifier' }};
			}
		}
	}
}
