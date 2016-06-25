function UnitTestMocks() {
	return {
		response: {
			writeHeader: jasmine.createSpy('res.writeHeader'),
			write: jasmine.createSpy('res.write'),
			end: jasmine.createSpy('res.end')
		},
		fileSystem: {
			readFile: jasmine.createSpy('fs.readFile')
		},
		request: function (headers, url){
			var headerList = [], url;
			
			if (headers){
				for (var i = 0; i < headers.length; i++){
					headerList.push(headers[i]);
				}
			}
			
			return { headers: headerList, url: url };
		},
		path: {
			join: function (a, b) {
				return a.toString() + b.toString();
			}
		},
		url: {
			parse: function (a, b) {
				return { pathname: a, query: { id: 'identifier' }};
			}
		}
	}
}
